import React, { useState, useEffect } from 'react'
import { render, Text } from 'ink'

function App() {
	const [counter, setCounter] = useState(0)

	return <Text color="green">{counter} tests passed</Text>
}

render(<App />)
