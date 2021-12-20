import React, { useReducer } from 'react'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'

import './Styles.css'
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  ALL_CLEAR: "all-clear",
  DELETE_DIGIT: "delete",
  EVALUATE: "evaluate",
}
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state
      if (payload.digit === "." && state.currentOperand == null) return state
      if (payload.digit === "." && state.currentOperand.includes(".")) return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) return state
      if (state.currentOperand == null) {
        return {
          ...state,
          operator: payload.operator,
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operator: payload.operator,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }
      return {
        ...state,
        previousOperand: calculate(state),
        operator: payload.operator,
        currentOperand: null,
      }
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite) {
        return{
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }
    case ACTIONS.EVALUATE:
      if(state.currentOperand == null || state.previousOperand == null || state.operator == null) return state
      return{
        ...state,
        previousOperand: null,
        operator: null,
        overwrite: true,
        currentOperand: calculate(state),
      }
    case ACTIONS.ALL_CLEAR: 
      return {}
    default: return state
  }
}
function calculate({ currentOperand, previousOperand, operator }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  let manipulate = ""
  if (isNaN(prev) || isNaN(current)) return ""
  switch (operator) {
    case "+":
      manipulate = prev + current
      break
    case "-":
      manipulate = prev - current
      break
    case "*":
      manipulate = prev * current
      break
    case "/":
      manipulate = prev / current
      break
    default: break
  }
  return manipulate.toString()
}
const INTEGER_FORMATTER = Intl.NumberFormat("hi-IN",{minimumFractionDigits:0})
function formatOperand(operand){
  if(operand == null) return 
  const [integer, decimal] = operand.split(".")
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operator }, dispatch] = useReducer(reducer, {})
  // dispatch({ type: "lol", payload: { digit: 1 } })
  return (
    <div className="calculator-container">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operator}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className='span-two' onClick={() => dispatch({ type: ACTIONS.ALL_CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationButton operator="+" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operator="-" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operator="*" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operator="÷" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  )
}
export default App