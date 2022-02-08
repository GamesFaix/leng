import { chunk } from 'lodash';
import * as React from 'react';
import { BoxCard } from '../../logic/model';
import BinderCard from './binder-card';

const cardAspectRatio = [2.5, 3.5];
const rowsPerPage = 3;
const colsPerPage = 3;

const cardMargin = 3;

type Props = {
    cards: BoxCard[],
    style: React.CSSProperties,
    scale: number
}

const BinderPage = (props: Props) => {
    const cardHeight = cardAspectRatio[1] * props.scale;
    const cardWidth = cardAspectRatio[0] * props.scale;
    const pageHeight = (cardHeight * rowsPerPage) + (cardMargin * 2 * rowsPerPage);
    const pageWidth =  (cardWidth * colsPerPage) + (cardMargin * 2 * colsPerPage);
    const rowsData = chunk(props.cards, colsPerPage);

    return (
        <div
            style={{
               ...props.style,
                width: `${pageWidth}px`,
                height: `${pageHeight}px`,
                backgroundColor: 'blue',
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
                            card={c}
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