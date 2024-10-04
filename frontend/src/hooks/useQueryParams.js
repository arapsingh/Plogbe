import { useLocation } from "react-router";

export default function useQueryParams() {
    const search = useLocation().search;
    const urlSearchParams = new URLSearchParams(search);
    const params = Array.from(urlSearchParams).reduce((acc, [key, value]) => {
        if (!acc[key]) {
            acc[key] = value;
        } else if (Array.isArray(acc[key])) {
            acc[key].push(value);
        } else {
            acc[key] = [acc[key], value];
        }
        return acc;
    }, {});
    return params;
}
