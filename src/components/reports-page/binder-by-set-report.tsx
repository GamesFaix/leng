import * as React from 'react';
import { BoxState } from '../../store/inventory';

type Props = {
    boxes: BoxState[]
}

const BinderBySetReport = (props: Props) => {
    return (<div>
        here's a report
    </div>);
}
export default BinderBySetReport;