import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectors } from "../../../store";

type Props = {
    value: string[],
    onChange: (value: string[]) => void
}

const BoxSelector = (props: Props) => {
    const boxNames = useSelector(selectors.boxes).map(b => b.name);

    function onChange(e: SelectChangeEvent) {
        const value = e.target.value as any as string[];
        props.onChange(value);
    }

    return (
        <Select
            value={props.value as any}
            multiple
            onChange={onChange}
            sx={{
                width: 200
            }}
        >
            {boxNames.map(b =>
                <MenuItem
                    key={b}
                    value={b}
                >
                    {b}
                </MenuItem>
            )}
        </Select>
    );
}
export default BoxSelector;