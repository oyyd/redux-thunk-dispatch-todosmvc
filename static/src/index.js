import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App'
import { createAppStore } from './store'
import 'todomvc-app-css/index.css'

function Entry(props) {
  const { store } = props;

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function main() {
  const store = createAppStore()

  render(
    <Entry store={store}/>,
    document.getElementById('root')
  )

  if (module.hot) {
    module.hot.accept()
  }
}

main()
