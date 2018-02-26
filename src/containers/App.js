import React, { Component } from 'react';
import Editor  from '../components/Editor';
import View from '../components/View';
import * as EditorActions from '../actions'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const App = ({text, actions}) => (
  <div className="App">
    <header className="App-header">
     <h1 className="App-title">Welcome to React</h1>
    </header>
    <div>
      <Editor text={text} actions={actions} />
      <View text={text} actions={actions} />
    </div>
  </div>
)

App.propTypes = {
  text: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  text: state.editor
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(EditorActions, dispatch)
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

