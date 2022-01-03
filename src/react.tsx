import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "./styles.scss";

const Index = () => {
    return <div>Hello React!</div>;
};

ReactDOM.render(
    <Index />,
    document.getElementById('app')
);