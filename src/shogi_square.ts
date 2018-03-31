import {
    Widget
} from "@phosphor/widgets";

import {
    Message
} from "@phosphor/messaging";

import {ShogiPiece} from "./shogi_piece";
import {DomUtils} from "./dom_utils";

type BoardRank = 0|1|2|3|4|5|6|7|8;
type BoardFile = 0|1|2|3|4|5|6|7|8;

export
interface Empty {
    discriminator: "i-am-an-empty"
}

type SquareContent = ShogiPiece | Empty;

export
function isAnEmpty(x: any): x is Empty {
    if ("discriminator" in x) {
        return x.discriminator === "i-am-an-empty";
    }
    return false;
}


export
class ShogiSquare extends Widget {
    public file: BoardFile;
    public rank: BoardRank;
    public _content: SquareContent;

    constructor(
        file: BoardFile,
        rank: BoardRank,
        content: SquareContent
    ) {
        // todo
        super({node: ShogiSquare.create_element(content)});
        this.file = file;
        this.rank = rank;
    }

    // setter getter for content calling update
    set content(content: SquareContent) {
        this._content = content;
        this.update();
    }

    get content(): SquareContent {
        return this._content;
    }

    onUpdateRequest(msg: Message): void {
        super.onUpdateRequest(msg);
        DomUtils.remove_all_children(this.node);
        if (isAnEmpty(this._content)) {
            this.node.appendChild(ShogiSquare.create_empty_square_content());
        } else {
            this.node.appendChild(this._content.node);
        }
    }
}

export
namespace ShogiSquare {
    export
    function create_element(content: SquareContent): HTMLElement {
        let square = document.createElement("div");
        square.classList.add("square");

        // Handle the special case of an empty square.
        if (isAnEmpty(content)) {
            square.appendChild(create_empty_square_content());
            return square;
        }
        // normal cases
        // It must be a ShogiPiece then so it is a Widget.
        // We can take its node.
        square.appendChild(content.node);
        return square;
    }

    export
    function create_empty_square_content(): HTMLElement {
        let square_content = document.createElement("div");
        square_content.classList.add("empty");
        return square_content;
    }
}
