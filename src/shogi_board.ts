import {
    Widget
} from '@phosphor/widgets';

import {
    DataGrid,
    DataModel,
    TextRenderer
} from '@phosphor/datagrid';

export
namespace ShogiBoard {
    export
    function create(model: Model): DataGrid {
        const grid = new DataGrid({
            baseColumnSize: 9,
            baseRowSize: 9,
            headerVisibility: "none",
            style: {
                    ...DataGrid.defaultStyle,
                gridLineColor: "rgba(255, 255, 255, 0.5)",
                voidColor: "transparent"
            }
        });

        const renderer = new TextRenderer({
            font: "bold 20px sans-serif",
            textColor: "#000000",
            format: ({value}) => {
                if (value === null || value === undefined || value === "") {
                    return new Widget({node: });
                }
                return
            },
            verticalAlignment: "middle",
            horizontalAlignment: "right"
        });

        grid.model = model;
        grid.addClass("shogi-grid");
        grid.cellRenderers.set("body", {}, renderer);

        return grid;
    }
}