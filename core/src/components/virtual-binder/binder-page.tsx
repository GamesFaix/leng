import { chunk } from 'lodash';
import { BoxCard } from "../../domain/inventory";
import BinderCard from './binder-card';
import { CSSProperties } from 'react';

const cardAspectRatio = [2.5, 3.5];
const rowsPerPage = 3;
const colsPerPage = 3;

const cardMargin = 3;

type Props = {
    cardGroups: BoxCard[][],
    style: CSSProperties,
    scale: number
}

const BinderPage = (props: Props) => {
    const cardHeight = cardAspectRatio[1] * props.scale;
    const cardWidth = cardAspectRatio[0] * props.scale;
    const pageHeight = (cardHeight * rowsPerPage) + (cardMargin * 2 * rowsPerPage);
    const pageWidth =  (cardWidth * colsPerPage) + (cardMargin * 2 * colsPerPage);
    const rowsData = chunk(props.cardGroups, colsPerPage);

    return (
        <div
            style={{
               ...props.style,
                width: `${pageWidth}px`,
                height: `${pageHeight}px`,
                backgroundColor: '#333333',
                display: 'flex',
                flexDirection: 'column',
                padding: '3px',
                borderRadius: '5px'
            }}
        >
            {rowsData.map((cs,row) =>
                <div key={row}
                    style={{
                        display: 'flex'
                    }}
                >
                    {cs.map((c,col) =>
                        <BinderCard
                            key={col}
                            cardGroup={c}
                            style={{
                                width: `${cardWidth}px`,
                                height: `${cardHeight}px`,
                                borderRadius: '5px',
                                margin: `${cardMargin}px`
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
export default BinderPage;