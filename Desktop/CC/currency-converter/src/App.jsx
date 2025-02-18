import { useState, useEffect } from 'react'
import './index.css'

function App() {
  const [amount, setAmount] = useState(1)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [convertedAmount, setConvertedAmount] = useState(null)

  const [currencies, setCurrencies] = useState([])

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all')
        const data = await response.json()
        
        const uniqueCurrencies = new Map()
        
        data.forEach(country => {
          if (country.currencies) {
            const currencyCode = Object.keys(country.currencies)[0]
            const currencyInfo = country.currencies[currencyCode]
            if (!uniqueCurrencies.has(currencyCode)) {
              uniqueCurrencies.set(currencyCode, {
                code: currencyCode,
                name: currencyInfo.name,
                symbol: currencyInfo.symbol,
                flag: country.flags.png
              })
            }
          }
        })
        
        setCurrencies(Array.from(uniqueCurrencies.values()))
      } catch (error) {
        console.error('Error fetching countries:', error)
      }
    }
    
    fetchCountries()
  }, [])

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
            <label className="form-label">Amount</label>
            <div className='input-container'>
              <span className="currency-symbol">
                {currencies.find(c => c.code === fromCurrency)?.symbol || ''}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          <div className="currency-selectors">
            <div className="form-group form-group-exh">
              <label className="form-label">From</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="form-select"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src={currency.flag} 
                        alt={currency.name} 
                        style={{ width: '20px', marginRight: '10px' }}
                      />
                      {currency.name} ({currency.code})
                    </div>
                  </option>
                ))}
              </select>
            </div>
            <div className="swap-container">
              <button 
                className="swap-button"
                onClick={() => {
                  const temp = fromCurrency;
                  setFromCurrency(toCurrency);
                  setToCurrency(temp);
                }}
              >
                ⇄
              </button>
            </div>
            <div className="form-group">
              <label className="form-label form-group-exh2">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="form-select"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src={currency.flag} 
                        alt={currency.name} 
                        style={{ width: '20px', marginRight: '10px' }}
                      />
                      {currency.name} ({currency.code})
                    </div>
                  </option>
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
