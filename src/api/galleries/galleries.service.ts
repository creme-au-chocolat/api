import { Injectable, NotFoundException } from '@nestjs/common';
import * as archiver from 'archiver';
import fetch from 'node-fetch';
import { HtmlParserService } from '../../html-parser/html-parser/html-parser.service';
import { parseTags } from '../../shared/helpers/parse-tags.helper';
import { GalleryDetailsEntity } from './types/gallery-details.entity';

@Injectable()
export class GalleriesService {
  constructor(private readonly htmlParser: HtmlParserService) {}

  async details(id: number): Promise<Required<GalleryDetailsEntity>> {
    const $ = await this.htmlParser.parse(`https://nhentai.net/g/${id}/`);

    if (!$('.title').text()) {
      throw new NotFoundException();
    }

    const details: Required<GalleryDetailsEntity> = {
      id: id,
      name: {
        before: $('#info > h1 > span.before')
          .text()
          .trim(),
        after: $('#info > h1 > span.after')
          .text()
          .trim(),
        content: $('#info > h1 > span.pretty')
          .text()
          .trim(),
      },
      thumbnail: $('#cover > a > img').data('src'),
      pages: parseInt($('#tags > div:nth-child(8) > span > a > span').text()),
      uploadDate: $('.tags > time').attr('datetime'),
      parodies: parseTags($('#tags > div:nth-child(1) > span > .tag'), $),
      characters: parseTags($('#tags > div:nth-child(2) > span > .tag'), $),
      tags: parseTags($('#tags > div:nth-child(3) > span > .tag'), $),
      artists: parseTags($('#tags > div:nth-child(4) > span > .tag'), $),
      groups: parseTags($('#tags > div:nth-child(5) > span > .tag'), $),
      languages: parseTags($('#tags > div:nth-child(6) > span > .tag'), $),
      categories: parseTags($('#tags > div:nth-child(7) > span > .tag'), $),
    };

    return details;
  }

  async page(id: number, page: number): Promise<NodeJS.ReadableStream> {
    const $ = await this.htmlParser.parse(
      `https://nhentai.net/g/${id}/${page}`,
    );

    const imageURI = $('#image-container > a > img').attr('src');

    if (!imageURI) {
      throw new NotFoundException();
    }

    const image = await fetch(imageURI);

    return image.body;
  }

  async thumbnail(id: number): Promise<NodeJS.ReadableStream> {
    const $ = await this.htmlParser.parse(`https://nhentai.net/g/${id}`);

    const imageURI = $('#cover > a > img').attr('data-src');

    if (!imageURI) {
      throw new NotFoundException();
    }

    const image = await fetch(imageURI);

    return image.body;
  }

  async download(
    outputStream: NodeJS.WritableStream,
    id: number,
    pages = 1,
  ): Promise<void> {
    const imageFetchingPromises: Promise<any>[] = [];
    const archive = archiver('zip');

    archive.pipe(outputStream);

    for (let i = 1; i <= pages; i++) {
      let image: NodeJS.ReadableStream;

      try {
        image = await this.page(id, i);
      } catch (error) {
        if (!(error instanceof NotFoundException)) {
          throw error;
        } else {
          break;
        }
      }

      const buffer = [];

      imageFetchingPromises.push(
        new Promise(resolve => {
          image.on('data', data => {
            buffer.push(data);
          });
          image.on('end', () => {
            resolve();
            archive.append(Buffer.concat(buffer), { name: `${i}.jpeg` });
          });
        }),
      );
    }

    await Promise.all(imageFetchingPromises);

    archive.finalize();
  }

  async random(): Promise<number> {
    const randomPage = await fetch('https://nhentai.net/random');
    const uri = randomPage.url.split('/');
    const randomId = uri[uri.length - 2];

    return parseInt(randomId);
  }
}
