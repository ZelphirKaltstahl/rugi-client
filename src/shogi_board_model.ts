import {
    DataGrid,
    DataModel,
    TextRenderer
} from '@phosphor/datagrid';

import {ShogiSquare} from "./shogi_square";
import {ShogiPiece} from "./shogi_piece";
import {ShogiHand} from "./shogi_hand";
import {Utils} from "./utils";
import {Player} from "./player";

export
class ShogiBoardModel extends DataModel {
    private _data: ShogiSquare[][];
    private _initial_state: string;

    constructor(options: ShogiBoardModel.IOptions = {}) {
        super();
        this.state = ShogiBoardModel.position_from_sfen(options.initial_sfen ||
                                                        ShogiBoardModel.default_initial_sfen);
    }

    // todo: what logic is needed in the getters setters?
    get state(): ShogiSquare[][] {
        return this._data;
    }
    set state(data: ShogiSquare[][]) {
        this._data = data;
    }

    toSfen(): string {
        // todo: state to sfen conversion
        return "SOME SFEN HERE";
    }

    rowCount(region: DataModel.RowRegion): number {
        return this._data.length;
    }

    columnCount(region: DataModel.ColumnRegion): number {
        return this._data[0].length;
    }

    data(region: DataModel.CellRegion, row: number, column: number): any {
        return this._data[row][column];
    }
}

export
namespace ShogiBoardModel {
    // assuming SFEN to look like this:
    // field 1: position on board
    // field 2: moving player
    // field 3: hands, if empty use "-"
    // field 4: move number
    // example:
    // "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1" (initial position)
    // upper case for black (sente) (moving first) (in hand and in position)
    // lower case for white (gote) (in hand and in position)

    export const default_initial_sfen =
        "lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b 1";
    const position_field_index = 0;
    const moving_player_field_index = 1;
    const hands_field_index = 2;
    const move_number_field_index = 3;

    export function position_from_sfen(sfen: string): ShogiSquare[][] {
        let squares: ShogiSquare[][] = [];
        let sfen_position_part = sfen.split(" ")[position_field_index];

        // split into single rows
        sfen_position_part.split("/").forEach((row_chars: string) => {
            let row_squares: ShogiSquare[] = [];
            // fill a row with squares according to the characters in sfen
            Array.from(row_chars).forEach((char) => {

            });
            // add the filled row
            squares.push(row_squares);
        });

        return squares;
    }

    function hands_from_sfen(sfen: string): {sente: ShogiHand, gote: ShogiHand} {

        function extract_hands_part(sfen: string): string {
            return sfen.split(" ")[hands_field_index];
        }

        function get_next_token(remaining: string): string {
            const acceptable_tokens_regexes = [
                    /^[1-9][0-9]*/,
                    /^[plnsgbrkPLNSGBRK]/,
                    /^[+][pPlLnNsSbBrR]/
            ];
            for (let token_regex of acceptable_tokens_regexes) {
                let res: string[] = token_regex.exec(remaining);
                if (res) {
                    return res[0];
                }
            }
            throw new Error("SFEN hands part is not valid");
        }

        function cut_prefix(str: string, prefix: string): string {
            return str.slice(prefix.length);
        }

        function handle_sente_piece_case(token: string, sente_hand: ShogiPiece[]): ShogiPiece[] {
            sente_hand.push(new ShogiPiece(string_to_piece_kind_map.get(token),
                                           Player.Sente));
            return sente_hand;
        }

        function handle_gote_piece_case(token: string, sente_hand: ShogiPiece[]): ShogiPiece[] {
            gote_hand.push(new ShogiPiece(string_to_piece_kind_map.get(token),
                                          Player.Gote));
            return gote_hand;
        }

        function handle_number_case() {}

        // initialize some stuff
        let remaining_hands_part = extract_hands_part(sfen);
        let sente_hand: ShogiPiece[] = [];
        let gote_hand: ShogiPiece[] = [];
        const string_to_piece_kind_map = ShogiPiece.get_string_to_piece_kind_map();

        // iterate over the whole hand part
        while (remaining_hands_part.length > 0) {
            let next_token = get_next_token(remaining_hands_part);

            if (ShogiPiece.is_sente_piece_string(next_token)) {
                sente_hand = handle_sente_piece_case(next_token, sente_hand);
                remaining_hands_part = cut_prefix(remaining_hands_part, next_token);

            } else if (ShogiPiece.is_gote_piece_string(next_token)) {
                gote_hand = handle_gote_piece_case(next_token, gote_hand);
                remaining_hands_part = cut_prefix(remaining_hands_part, next_token);

            } else if (Utils.string_is_integer(next_token)) {
                let number_of_pieces: number = parseInt(next_token);
                // cut by count of piece
                remaining_hands_part = cut_prefix(remaining_hands_part, next_token);
                next_token = get_next_token(remaining_hands_part);

                // add as many pieces as the number indicated
                for (let counter = 0; counter < number_of_pieces; counter++) {
                    if (ShogiPiece.is_sente_piece_string(next_token)) {
                        // to sente hand
                        sente_hand = handle_sente_piece_case(next_token, sente_hand);

                    } else if (ShogiPiece.is_gote_piece_string(next_token)) {
                        // to gote hand
                        gote_hand = handle_gote_piece_case(next_token, gote_hand);

                    } else {
                        // if the character after the number is not a character representing a piece,
                        // the SFEN is not valid
                        throw new Error("SFEN hands part is not valid");
                    }
                }
                // cut by piece
                remaining_hands_part = cut_prefix(remaining_hands_part, next_token);
            } else {
                // if the character is not indicating:
                // an amount of pieces,
                // a sente piece,
                // of a gote piece,
                // the SFEN is not valid
                throw new Error("SFEN hands part is not valid");
            }
        }
        return {sente: {pieces: sente_hand},
                gote: {pieces: gote_hand}};
    }

    function moving_player_from_sfen(sfen: string): Player {

    }

    function piece_from_sfen_char(char: string): ShogiPiece {

    }

    export
    interface IOptions {
        initial_position?: ShogiSquare[][],
        initial_sfen?: string
    }
}