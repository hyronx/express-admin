var qb = require('../lib/qb')();

exports.get = function (req, res, next) {
    _data(req, res, next);
}

function _data(req, res, next) {
    var settings = res.locals._admin.settings,
        custom = res.locals._admin.custom;

    var sections = {};
    var tables = [];
    for (var key in settings) {
        var item = settings[key];
        if (!item.mainview.show || !item.table.pk || item.table.view) continue;
        var collection = tables;
        if (item.table.section) {
            var section = sections[item.table.section];
            if (!section) {
                sections[item.table.section] = {
                    title: item.table.section,
                    description: item.table.sectionDescription,
                    items: [],
                }
                section = sections[item.table.section];
            }
            collection = section.items;
        }
        collection.push({
          slug: item.slug,
          name: item.table.verbose,
          description: item.table.description
        });
    }
    var rightSide = Object.keys(sections).map((k) => sections[k]);
    var leftSide = rightSide.splice(0, Math.floor(rightSide.length / 2));
    var columns = [{sections: leftSide}, {sections: rightSide}];

    var views = [];
    for (var key in settings) {
        var item = settings[key];
        if (!item.mainview.show || !item.table.view) continue;
        views.push({
          slug: item.slug,
          name: item.table.verbose,
          description: item.table.description
        });
    }

    var customs = [];
    for (var key in custom) {
        var item = custom[key].app;
        if (!item || !item.mainview || !item.mainview.show) continue;
        customs.push({
          slug: item.slug,
          name: item.verbose,
          description: item.table.description
        });
    }

    res.locals.columns = !columns ? null : columns;
    res.locals.tables = !tables.length ? null : {items: tables};
    res.locals.views = !views.length ? null : {items: views};
    res.locals.custom = !customs.length ? null : {items: customs};
    
    res.locals.partials = {
        content:  'mainview'
    };

    next();
}
