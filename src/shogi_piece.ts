import {
    Widget
} from '@phosphor/widgets';

import {Player} from "./player";
import {ShogiPieceKind} from "./shogi_piece_kind";

export
class ShogiPiece extends Widget {
    public kind: ShogiPieceKind;
    public owner: Player;

    constructor(kind: ShogiPieceKind, owner: Player) {
        super({node: ShogiPiece.create_element(kind, owner)});
        this.kind = kind;
        this.owner = owner;
    }
}

export
namespace ShogiPiece {
    export
    function create_element(kind: ShogiPieceKind, owner: Player): HTMLElement {
        let piece_container = document.createElement("div");
        piece_container.classList.add("shogi-piece");

        let piece_label_span = document.createElement("span");
        piece_label_span.classList.add(`owned-by-${owner}`);

        let piece_label = document.createTextNode(kind);

        piece_label_span.appendChild(piece_label);
        piece_container.appendChild(piece_label_span);
        return piece_container;
    }

    export
    function get_string_to_piece_kind_map(): Map<string, ShogiPieceKind> {
        const key_value_array: [string, ShogiPieceKind][] = [
            ["p", ShogiPieceKind.Pawn],
            ["P", ShogiPieceKind.Pawn],
            ["+p", ShogiPieceKind.PromotedPawn],
            ["+P", ShogiPieceKind.PromotedPawn],
            ["l", ShogiPieceKind.Lance],
            ["L", ShogiPieceKind.Lance],
            ["+l", ShogiPieceKind.PromotedLance],
            ["+L", ShogiPieceKind.PromotedLance],
            ["n", ShogiPieceKind.Knight],
            ["N", ShogiPieceKind.Knight],
            ["+n", ShogiPieceKind.PromotedKnight],
            ["+N", ShogiPieceKind.PromotedKnight],
            ["s", ShogiPieceKind.Silver],
            ["S", ShogiPieceKind.Silver],
            ["+s", ShogiPieceKind.PromotedSilver],
            ["+S", ShogiPieceKind.PromotedSilver],
            ["g", ShogiPieceKind.Gold],
            ["G", ShogiPieceKind.Gold],
            ["b", ShogiPieceKind.Bishop],
            ["B", ShogiPieceKind.Bishop],
            ["+b", ShogiPieceKind.PromotedBishop],
            ["+B", ShogiPieceKind.PromotedBishop],
            ["r", ShogiPieceKind.Rook],
            ["R", ShogiPieceKind.Rook],
            ["+r", ShogiPieceKind.PromotedRook],
            ["+R", ShogiPieceKind.PromotedRook],
            ["k", ShogiPieceKind.KingGote],
            ["K", ShogiPieceKind.KingSente]
        ];
        const char_to_piece_kind = new Map<string, ShogiPieceKind>(key_value_array);
        return char_to_piece_kind;
    }

    // TODO: BAD: two times the same list of strings, need to update 2 places if changes
    // Solution at: https://stackoverflow.com/a/33379195/1829329 does not look much better.
    export type SenteShogiPieceString =
        "P" | "L" | "N" | "S" | "G" | "B" | "R" | "K" |
        "+P" | "+L" | "+N"  | "+S" | "+B"  | "+R" ;
    export type GoteShogiPieceString =
        "p" | "l" | "n" | "s" | "g" | "b" | "r" | "k" |
        "+p" | "+l" | "+n"  | "+s" | "+b"  | "+r" ;

    export
    function is_sente_piece_string(x: string): x is SenteShogiPieceString {
        return x in ["P", "L", "N", "S", "G", "B", "R", "K",
                     "+P", "+L", "+N" , "+S", "+B" , "+R"];
    }
    export
    function is_gote_piece_string(x: string): x is GoteShogiPieceString {
        return x in ["p", "l", "n", "s", "g", "b", "r", "k",
                     "+p", "+l", "+n" , "+s", "+b" , "+r"];
    }
}