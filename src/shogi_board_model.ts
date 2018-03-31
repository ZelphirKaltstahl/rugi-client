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

        function tokenize_hand_part(remaining: string): string {
            function regex_prio_sorter(regex1, regex2): boolean {
                return elem1[1] > elem2[1];
            }
            // regexes with priority / precedence
            const tokens_regexes: [RegExp, number] = [
                [/^[1-9][0-9]*[plnsgbrkPLNSGBRK]/, 3],
                [/^[+][pPlLnNsSbBrR]/, 2]
                [/^[plnsgbrkPLNSGBRK]/, 1]
            ];

            let tokens = string[];
            for (let token_regex of tokens_regexes.sort(regex_prio_sorter)) {
                let res: string[] = token_regex.exec(remaining);
                if (res && res.length > 0) {
                    return tokens.push(res[0]);
                }
            }
            return tokens;
        }

        function split_amount_and_type_token(token: string) {
            // for example 10p
            const number_regex = /[1-9][0-9]*/;
            let num_res = number_regex.exec(token);
            if (num_res && num_res.length > 0) {
                return [num_res, token.slice(num_res.length)];
            }
            throw new Error("Token of SFEN hands part is not valid");
        }

        // initialize some stuff
        const string_to_piece_kind_map = ShogiPiece.get_string_to_piece_kind_map();
        let hand_tokens: string[] = tokenize_hand_part(extract_hands_part(sfen));
        let sente_hand: ShogiPiece[] = [];
        let gote_hand: ShogiPiece[] = [];

        hand_tokens.forEach((token: string) => {
            if (ShogiPiece.is_sente_piece_string(token)) {
                sente_hand.push(new ShogiPiece(string_to_piece_kind_map.get(token),
                                               Player.Sente));
            } else if (ShogiPiece.is_gote_piece_string(token)) {
                gote_hand.push(new ShogiPiece(string_to_piece_kind_map.get(token),
                                              Player.Gote));
            } else if (Utils.string_is_integer(token[0])) {
                [amount, piece_type_char] = split_amount_and_type_token(token);
                if (ShogiPiece.is_sente_piece_string(token)) {
                    for (let counter = 0; counter < amount; counter++) {
                        sente_hand.push(new ShogiPiece(string_to_piece_kind_map.get(piece_type_char),
                                                       Player.Sente));
                    }
                } else if (ShogiPiece.is_gote_piece_string(token)) {
                    for (let counter = 0; counter < amount; counter++) {
                        gote_hand.push(new ShogiPiece(string_to_piece_kind_map.get(piece_type_char),
                                                      Player.Gote));
                    }
                } else {
                    throw new Error("Token of SFEN hands part is not valid");
                }
            } else {
                throw new Error("SFEN hands part is not valid");
            }
        });
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