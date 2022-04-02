import { ISchema } from '../scripts/Language';

const css: ISchema = {
  name: 'css',
  expressions: [
    ['comment', [[/\/\*[\S\s]*?\*\/|\/\/.*$/gm]]],
    ['string', [[/(["'])(?:(?=(\\?))\2.)*?\1/gm], [/(?<=url\()[\s\w,./:;=]+(?=\))/gm]]],
    ['keyword', [[/[[\]]|(!important)/gm], [/@\w*(?=\s*{*)/gm]]],
    ['entity', [[/#\w+(?=[\t (.[{])/gm], [/(?<=#)([\dA-Fa-f]{6}|[\dA-Fa-f]{3})/gm]]],
    ['variable', [[/(?<=:\s*var)\([\w-]*\)(?=\s*;)/gm], [/(?<=[;{]\s*)--[\w-]*(?=\s*:)/gm], [/\*\s*(?=,|:)/gm]]],
    ['operator', [[/(?<=:*)(url|var|rgba+)(?=\()/gm]]],
    [
      'constant',
      [
        [/(?<=[\s(,]+)[\d%.-]+\w{0,3}(?=[\t !),;])/gm],
        [/(?<=\[)[\w-]+(?=]|=)/gm],
        [/(?<=[\w()*\]]|^):{1,2}[\w-]+\d*(?!;|\w)/gm],
        [/\.[A-Za-z]+[\w-]+(?=[\t (.:;[{])/gm],
        [/#(?=[\dA-Fa-f]{6}|[\dA-Fa-f]{3})/gm],
      ],
    ],
    ['source', [[/(?<=^| |,)[1-6a-z]+(?!-|\w)/gm]]],
  ],
  keywords: [
    [
      'variable',
      [
        'a',
        'abbr',
        'acronym',
        'address',
        'area',
        'article',
        'aside',
        'audio',
        'b',
        'base',
        'big',
        'bdi',
        'bdo',
        'blockquote',
        'body',
        'br',
        'button',
        'canvas',
        'caption',
        'cite',
        'code',
        'col',
        'colgroup',
        'command',
        'data',
        'datalist',
        'dd',
        'del',
        'details',
        'dfn',
        'dialog',
        'div',
        'dl',
        'dt',
        'em',
        'embed',
        'fieldset',
        'figcaption',
        'figure',
        'footer',
        'form',
        'frame',
        'frameset',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'hgroup',
        'head',
        'header',
        'hr',
        'html',
        'i',
        'iframe',
        'img',
        'input',
        'ins',
        'kbd',
        'keygen',
        'label',
        'legend',
        'li',
        'link',
        'main',
        'map',
        'mark',
        'meta',
        'meter',
        'nav',
        'noframes',
        'noscript',
        'object',
        'ol',
        'optgroup',
        'option',
        'output',
        'p',
        'param',
        'picture',
        'pre',
        'progress',
        'q',
        'ruby',
        'rb',
        'rt',
        'rtc',
        'rp',
        's',
        'samp',
        'script',
        'section',
        'select',
        'small',
        'source',
        'span',
        'strike',
        'strong',
        'style',
        'sub',
        'summary',
        'sup',
        'svg',
        'table',
        'tbody',
        'td',
        'template',
        'textarea',
        'tfoot',
        'th',
        'thead',
        'time',
        'title',
        'tr',
        'tt',
        'track',
        'u',
        'ul',
        'var',
        'video',
        'wbr',
      ],
    ],
  ],
};

export default css;
