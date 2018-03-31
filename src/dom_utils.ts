export
namespace DomUtils {
    export
    function remove_all_children(dom_elem: HTMLElement): void {
        while(dom_elem.hasChildNodes()) {
            dom_elem.removeChild(dom_elem.firstChild);
        }
    }
}