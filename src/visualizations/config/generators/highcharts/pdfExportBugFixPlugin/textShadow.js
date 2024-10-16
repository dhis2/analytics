/* This plugin was provided by HighCharts support and resolves an issue with label
 * text that has a white outline, such as the one we use for stacked bar charts.
 * For example: "ANC: 1-4 visits by districts this year (stacked)"
 * This issue has actually been resolved in HighCharts v11, so once we have upgraded
 * to that version, this plugin can be removed. */

export default function (H) {
    const { AST, defaultOptions, downloadURL } = H,
        { ajax } = H.HttpUtilities,
        doc = document,
        win = window,
        OfflineExporting =
            H._modules['Extensions/OfflineExporting/OfflineExporting.js'],
        { getScript, svgToPdf, imageToDataUrl, svgToDataUrl } = OfflineExporting

    H.wrap(
        OfflineExporting,
        'downloadSVGLocal',
        function (proceed, svg, options, failCallback, successCallback) {
            var dummySVGContainer = doc.createElement('div'),
                imageType = options.type || 'image/png',
                filename =
                    (options.filename || 'chart') +
                    '.' +
                    (imageType === 'image/svg+xml'
                        ? 'svg'
                        : imageType.split('/')[1]),
                scale = options.scale || 1
            var svgurl,
                blob,
                finallyHandler,
                libURL = options.libURL || defaultOptions.exporting.libURL,
                objectURLRevoke = true,
                pdfFont = options.pdfFont
            // Allow libURL to end with or without fordward slash
            libURL = libURL.slice(-1) !== '/' ? libURL + '/' : libURL
            /*
             * Detect if we need to load TTF fonts for the PDF, then load them and
             * proceed.
             *
             * @private
             */
            var loadPdfFonts = function (svgElement, callback) {
                var hasNonASCII = function (s) {
                    return (
                        // eslint-disable-next-line no-control-regex
                        /[^\u0000-\u007F\u200B]+/.test(s)
                    )
                }
                // Register an event in order to add the font once jsPDF is
                // initialized
                var addFont = function (variant, base64) {
                    win.jspdf.jsPDF.API.events.push([
                        'initialized',
                        function () {
                            this.addFileToVFS(variant, base64)
                            this.addFont(variant, 'HighchartsFont', variant)
                            if (!this.getFontList().HighchartsFont) {
                                this.setFont('HighchartsFont')
                            }
                        },
                    ])
                }
                // If there are no non-ASCII characters in the SVG, do not use
                // bother downloading the font files
                if (pdfFont && !hasNonASCII(svgElement.textContent || '')) {
                    pdfFont = void 0
                }
                // Add new font if the URL is declared, #6417.
                var variants = ['normal', 'italic', 'bold', 'bolditalic']
                // Shift the first element off the variants and add as a font.
                // Then asynchronously trigger the next variant until calling the
                // callback when the variants are empty.
                var normalBase64
                var shiftAndLoadVariant = function () {
                    var variant = variants.shift()
                    // All variants shifted and possibly loaded, proceed
                    if (!variant) {
                        return callback()
                    }
                    var url = pdfFont && pdfFont[variant]
                    if (url) {
                        ajax({
                            url: url,
                            responseType: 'blob',
                            success: function (data, xhr) {
                                var reader = new FileReader()
                                reader.onloadend = function () {
                                    if (typeof this.result === 'string') {
                                        var base64 = this.result.split(',')[1]
                                        addFont(variant, base64)
                                        if (variant === 'normal') {
                                            normalBase64 = base64
                                        }
                                    }
                                    shiftAndLoadVariant()
                                }
                                reader.readAsDataURL(xhr.response)
                            },
                            error: shiftAndLoadVariant,
                        })
                    } else {
                        // For other variants, fall back to normal text weight/style
                        if (normalBase64) {
                            addFont(variant, normalBase64)
                        }
                        shiftAndLoadVariant()
                    }
                }
                shiftAndLoadVariant()
            }
            /*
             * @private
             */
            var downloadPDF = function () {
                AST.setElementHTML(dummySVGContainer, svg)
                var textElements =
                        dummySVGContainer.getElementsByTagName('text'),
                    // Copy style property to element from parents if it's not
                    // there. Searches up hierarchy until it finds prop, or hits the
                    // chart container.
                    setStylePropertyFromParents = function (el, propName) {
                        var curParent = el
                        while (curParent && curParent !== dummySVGContainer) {
                            if (curParent.style[propName]) {
                                el.style[propName] = curParent.style[propName]
                                break
                            }
                            curParent = curParent.parentNode
                        }
                    }
                var titleElements,
                    outlineElements
                    // Workaround for the text styling. Making sure it does pick up
                    // settings for parent elements.
                ;[].forEach.call(textElements, function (el) {
                    // Workaround for the text styling. making sure it does pick up
                    // the root element
                    ;['font-family', 'font-size'].forEach(function (property) {
                        setStylePropertyFromParents(el, property)
                    })
                    el.style.fontFamily =
                        pdfFont && pdfFont.normal
                            ? // Custom PDF font
                              'HighchartsFont'
                            : // Generic font (serif, sans-serif etc)
                              String(
                                  el.style.fontFamily &&
                                      el.style.fontFamily.split(' ').splice(-1)
                              )
                    // Workaround for plotband with width, removing title from text
                    // nodes
                    titleElements = el.getElementsByTagName('title')
                    ;[].forEach.call(titleElements, function (titleElement) {
                        el.removeChild(titleElement)
                    })

                    // Remove all .highcharts-text-outline elements, #17170
                    outlineElements = el.getElementsByClassName(
                        'highcharts-text-outline'
                    )
                    while (outlineElements.length > 0) {
                        const outline = outlineElements[0]
                        if (outline.parentNode) {
                            outline.parentNode.removeChild(outline)
                        }
                    }
                })
                var svgNode = dummySVGContainer.querySelector('svg')
                if (svgNode) {
                    loadPdfFonts(svgNode, function () {
                        svgToPdf(svgNode, 0, function (pdfData) {
                            try {
                                downloadURL(pdfData, filename)
                                if (successCallback) {
                                    successCallback()
                                }
                            } catch (e) {
                                failCallback(e)
                            }
                        })
                    })
                }
            }
            // Initiate download depending on file type
            if (imageType === 'image/svg+xml') {
                // SVG download. In this case, we want to use Microsoft specific
                // Blob if available
                try {
                    if (typeof win.navigator.msSaveOrOpenBlob !== 'undefined') {
                        // eslint-disable-next-line no-undef
                        blob = new MSBlobBuilder()
                        blob.append(svg)
                        svgurl = blob.getBlob('image/svg+xml')
                    } else {
                        svgurl = svgToDataUrl(svg)
                    }
                    downloadURL(svgurl, filename)
                    if (successCallback) {
                        successCallback()
                    }
                } catch (e) {
                    failCallback(e)
                }
            } else if (imageType === 'application/pdf') {
                if (win.jspdf && win.jspdf.jsPDF) {
                    downloadPDF()
                } else {
                    // Must load pdf libraries first. // Don't destroy the object
                    // URL yet since we are doing things asynchronously. A cleaner
                    // solution would be nice, but this will do for now.
                    objectURLRevoke = true
                    getScript(libURL + 'jspdf.js', function () {
                        getScript(libURL + 'svg2pdf.js', downloadPDF)
                    })
                }
            } else {
                // PNG/JPEG download - create bitmap from SVG
                svgurl = svgToDataUrl(svg)
                finallyHandler = function () {
                    try {
                        OfflineExporting.domurl.revokeObjectURL(svgurl)
                    } catch (e) {
                        // Ignore
                    }
                }
                // First, try to get PNG by rendering on canvas
                imageToDataUrl(
                    svgurl,
                    imageType,
                    {},
                    scale,
                    function (imageURL) {
                        // Success
                        try {
                            downloadURL(imageURL, filename)
                            if (successCallback) {
                                successCallback()
                            }
                        } catch (e) {
                            failCallback(e)
                        }
                    },
                    function () {
                        // Failed due to tainted canvas
                        // Create new and untainted canvas
                        var canvas = doc.createElement('canvas'),
                            ctx = canvas.getContext('2d'),
                            imageWidth =
                                svg.match(
                                    // eslint-disable-next-line no-useless-escape
                                    /^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/
                                )[1] * scale,
                            imageHeight =
                                svg.match(
                                    // eslint-disable-next-line no-useless-escape
                                    /^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/
                                )[1] * scale,
                            downloadWithCanVG = function () {
                                var v = win.canvg.Canvg.fromString(ctx, svg)
                                v.start()
                                try {
                                    downloadURL(
                                        win.navigator.msSaveOrOpenBlob
                                            ? canvas.msToBlob()
                                            : canvas.toDataURL(imageType),
                                        filename
                                    )
                                    if (successCallback) {
                                        successCallback()
                                    }
                                } catch (e) {
                                    failCallback(e)
                                } finally {
                                    finallyHandler()
                                }
                            }
                        canvas.width = imageWidth
                        canvas.height = imageHeight
                        if (win.canvg) {
                            // Use preloaded canvg
                            downloadWithCanVG()
                        } else {
                            // Must load canVG first. // Don't destroy the object
                            // URL yet since we are doing things asynchronously. A
                            // cleaner solution would be nice, but this will do for
                            // now.
                            objectURLRevoke = true
                            getScript(libURL + 'canvg.js', function () {
                                downloadWithCanVG()
                            })
                        }
                    },
                    // No canvas support
                    failCallback,
                    // Failed to load image
                    failCallback,
                    // Finally
                    function () {
                        if (objectURLRevoke) {
                            finallyHandler()
                        }
                    }
                )
            }
        }
    )
}
