module.exports = function (window) {
    "use strict";

    require('./css/i-chart.css'); // <-- define your own itag-name here

    var itagCore = require('itags.core')(window),
        itagName = 'i-chart', // <-- define your own itag-name here
        DOCUMENT = window.document,
        ITSA = window.ITSA,
        Itag;

    if (!window.ITAGS[itagName]) {

        Itag = DOCUMENT.defineItag(itagName, {
            attrs: {
                'x-axis-label': 'string',
                'y-axis-label': 'string',
                legend: 'boolean',
                'data-values': 'string'
            },

            init: function() {
                var element = this,
                    designNode = element.getItagContainer(),
                    sectionNodes = designNode.getAll('>section'),
                    dataNode = designNode.getHTML(sectionNodes),
                    series;

                if (!element.model.series) {
                    // when initializing: make sure NOT to overrule model-properties that already
                    // might have been defined when modeldata was bound. Therefore, use `defineWhenUndefined`
                    try {
                        series = JSON.parseWithDate(dataNode);
                    }
                    catch(err) {
                        console.warn(err);
                        series = [];
                    }
                    element.defineWhenUndefined('series', series); // sets element.model.someprop = somevalue; when not defined yet
                }
                // the sectionNondes should contain the attribute `is`.
                // these properties will be used during syncing:
                // is="header"
                // is="footer"
                // is="x-axis"
                // is="y-axis"
                // is="x2-axis"
                // is="y2-axis"
                sectionNodes.forEach(function(sectionNode) {
                    var is = sectionNode.getAttr('is');
                    is && element.defineWhenUndefined(is, sectionNode.getHTML()); // sets element.model.someprop = somevalue; when not defined yet
                });
            },

            render: function() {
                var element = this;
                element.setData('_container', element.append('<section></section>'));
            },

            sync: function() {
                var element = this,
                    container = element.getData('_container'),
                    model = element.model,
                    content = '';
                if (model.title) {
                    content += '<section is="title">'+model.title+'</section>';
                }
                content += '<section is="graph">'+element.renderGraph()+'</section>';
                if (model.footer) {
                    content += '<section is="footer">'+model.footer+'</section>';
                }
                container.setHTML(content);
            },

            renderGraph: function() {
                return '<p>i-chart cannot be used directly: you need a speudoClass</p>';
            }

        });

        window.ITAGS[itagName] = Itag;
    }

    return window.ITAGS[itagName];
};
