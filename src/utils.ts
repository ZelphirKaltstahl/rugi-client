export
namespace Utils {
    export
    function string_is_integer(str: string): boolean {
        function string_is_number (str: string): boolean {
            return !isNaN(str);
        }
        function number_string_is_integer (num_str: string) {
            return parseInt(num_str, 10).toString() === num_str;
        }
        return string_is_number(str) && number_string_is_integer(str);
    }
}