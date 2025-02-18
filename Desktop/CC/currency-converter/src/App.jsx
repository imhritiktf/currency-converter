import { useState } from 'react'
import './index.css'
import { FaRupeeSign } from "react-icons/fa";
function App() {
  const [amount, setAmount] = useState(1)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [convertedAmount, setConvertedAmount] = useState(null)

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR']

  const handleConvert = async () => {
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
      const data = await response.json()
      const rate = data.rates[toCurrency]
      setConvertedAmount((amount * rate).toFixed(2))
    } catch (error) {
      console.error('Error converting currency:', error)
    }
  }

  return (
    <div className="app-container">
      <div className="converter-box">
        <div className="title-box">
        <h1 className="converter-title">Currency Converter</h1>
        </div>
        <div className="converter-form">
          <div className="form-group" id='form-group-1'>
            <label className="form-label" >Amount</label>
            <div className='input-container'>
            <FaRupeeSign className='icon'></FaRupeeSign>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input"
            />
            </div>

          </div>
          <div className="currency-selectors">
            <div className="form-group">
              <label className="form-label">From</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="form-select"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="form-select"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleConvert}
            className="convert-button"
          >
            Convert
          </button>
          {convertedAmount && (
            <div className="result-container">
              <p className="result-text">
                {amount} {fromCurrency} = {convertedAmount} {toCurrency}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
