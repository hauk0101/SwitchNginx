import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Menu from './components/Menu';
import Header from './components/Header';
import Content from './components/Content'

class App extends Component {
    render() {
        return <>
            {/*<Header/>*/}
            {/*<Menu/>*/}
            <Content/>
        </>
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));
