import { MdParser } from '../MdParser.js'

const Parser = new MdParser()

describe('MdParser class', () => {
    it('converts text into HTML', () => {
        const inlineTests = [
            ['_italic_', '<em>italic</em>'],
            ['*bold*', '<strong>bold</strong>'],
            [
                '_ not italic because there is a space _',
                '_ not italic because there is a space _',
            ],
            [':-)', '<span>\u{1F642}</span>'],
            [':)', '<span>\u{1F642}</span>'],
            [':-(', '<span>\u{1F641}</span>'],
            [':(', '<span>\u{1F641}</span>'],
            [':+1', '<span>\u{1F44D}</span>'],
            [':-1', '<span>\u{1F44E}</span>'],
            [
                'mixed _italic_ *bold* and :+1',
                'mixed <em>italic</em> <strong>bold</strong> and <span>\u{1F44D}</span>',
            ],
            ['_italic with * inside_', '<em>italic with * inside</em>'],
            ['*bold with _ inside*', '<strong>bold with _ inside</strong>'],

            // italic marker followed by : should work
            ['_italic_:', '<em>italic</em>:'],
            [
                '_italic_: some text, *bold*: some other text',
                '<em>italic</em>: some text, <strong>bold</strong>: some other text',
            ],
            // bold marker followed by : should work
            ['*bold*:', '<strong>bold</strong>:'],
            [
                '*bold*: some text, _italic_: some other text',
                '<strong>bold</strong>: some text, <em>italic</em>: some other text',
            ],

            // italic marker inside an italic string not allowed
            ['_italic with _ inside_', '_italic with _ inside_'],
            // bold marker inside a bold string not allowed
            ['*bold with * inside*', '*bold with * inside*'],
            [
                '_multiple_ italic in the _same line_',
                '<em>multiple</em> italic in the <em>same line</em>',
            ],
            // nested italic/bold combinations not allowed
            [
                '_italic with *bold* inside_',
                '<em>italic with *bold* inside</em>',
            ],
            [
                '*bold with _italic_ inside*',
                '<strong>bold with _italic_ inside</strong>',
            ],
            ['text with : and :)', 'text with : and <span>\u{1F642}</span>'],
            [
                '(parenthesis and :))',
                '(parenthesis and <span>\u{1F642}</span>)',
            ],
            [
                ':((parenthesis:))',
                '<span>\u{1F641}</span>(parenthesis<span>\u{1F642}</span>)',
            ],
            [':+1+1', '<span>\u{1F44D}</span>+1'],
            ['-1:-1', '-1<span>\u{1F44E}</span>'],

            // links
            [
                'example.com/path',
                '<a href="http://example.com/path">example.com/path</a>',
            ],

            // not recognized links with italic marker inside not converted
            [
                'example_with_underscore.com/path',
                'example_with_underscore.com/path',
            ],
            [
                'example_with_underscore.com/path_with_underscore',
                'example_with_underscore.com/path_with_underscore',
            ],

            // markers around non-recognized links
            [
                'link example_with_underscore.com/path should _not_ be converted',
                'link example_with_underscore.com/path should <em>not</em> be converted',
            ],
            [
                'link example_with_underscore.com/path should *not* be converted',
                'link example_with_underscore.com/path should <strong>not</strong> be converted',
            ],

            // italic marker inside links not converted
            [
                'example.com/path_with_underscore',
                '<a href="http://example.com/path_with_underscore">example.com/path_with_underscore</a>',
            ],
            [
                '_italic_ and *bold* with a example.com/link_with_underscore',
                '<em>italic</em> and <strong>bold</strong> with a <a href="http://example.com/link_with_underscore">example.com/link_with_underscore</a>',
            ],
            [
                'example.com/path with *bold* after :)',
                '<a href="http://example.com/path">example.com/path</a> with <strong>bold</strong> after <span>\u{1F642}</span>',
            ],
            [
                '_before_ example.com/path_with_underscore *after* :)',
                '<em>before</em> <a href="http://example.com/path_with_underscore">example.com/path_with_underscore</a> <strong>after</strong> <span>\u{1F642}</span>',
            ],

            // italic/bold markers right after non-word characters
            [
                '_If % of ART retention rate after 12 months >90(%)_: Sustain the efforts.',
                '<em>If % of ART retention rate after 12 months &gt;90(%)</em>: Sustain the efforts.',
            ],
            [
                '*If % of ART retention rate after 12 months >90(%)*: Sustain the efforts.',
                '<strong>If % of ART retention rate after 12 months &gt;90(%)</strong>: Sustain the efforts.',
            ],
        ]

        inlineTests.forEach((test) => {
            const renderedText = Parser.render(test[0])

            expect(renderedText).toEqual(`<p>${test[1]}</p>\n`)
        })

        const blockTests = [
            // heading
            ['# Heading 1', '<h1>Heading 1</h1>'],
            ['## Heading 2', '<h2>Heading 2</h2>'],
            ['### Heading 3', '<h3>Heading 3</h3>'],
            ['#### Heading 4', '<h4>Heading 4</h4>'],
            ['##### Heading 5', '<h5>Heading 5</h5>'],
            ['###### Heading 6', '<h6>Heading 6</h6>'],
            ['# *Bold head*', '<h1><strong>Bold head</strong></h1>'],
            ['## _Italic title_', '<h2><em>Italic title</em></h2>'],
            [
                '### *Bold* and _italic_ title',
                '<h3><strong>Bold</strong> and <em>italic</em> title</h3>',
            ],

            // lists
            [
                '* first\n* second\n* third',
                '<ul>\n<li>first</li>\n<li>second</li>\n<li>third</li>\n</ul>',
            ],
            [
                '1. one\n1. two\n1. three\n',
                '<ol>\n<li>one</li>\n<li>two</li>\n<li>three</li>\n</ol>',
            ],
            [
                '* *first*\n* second\n* _third_',
                '<ul>\n<li><strong>first</strong></li>\n<li>second</li>\n<li><em>third</em></li>\n</ul>',
            ],
        ]

        blockTests.forEach((test) => {
            const renderedText = Parser.render(test[0])

            expect(renderedText).toEqual(`${test[1]}\n`)
        })
    })
})
