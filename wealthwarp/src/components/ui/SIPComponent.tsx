'use client'

import React, { useState } from 'react'

const SIPComponent = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000)
  const [annualRate, setAnnualRate] = useState(12)
  const [years, setYears] = useState(10)
  const [result, setResult] = useState<number | null>(null)

  const calculateSIP = () => {
    const r = annualRate / 12 / 100
    const n = years * 12
    const amount =
      monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
    setResult(Math.round(amount))
  }

  return (
    <div className="p-4 border rounded-xl max-w-md mx-auto space-y-4 shadow">
      <h2 className="text-xl font-bold">SIP Calculator</h2>

      <div className="space-y-2">
        <label>Monthly Investment (₹)</label>
        <input
          type="number"
          value={monthlyInvestment}
          onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />

        <label>Annual Return Rate (%)</label>
        <input
          type="number"
          value={annualRate}
          onChange={(e) => setAnnualRate(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />

        <label>Investment Duration (Years)</label>
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={calculateSIP}
        className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition"
      >
        Calculate
      </button>

      {result !== null && (
        <div className="text-center mt-4">
          <p className="text-lg font-semibold text-green-600">
            ₹{result.toLocaleString()} after {years} years
          </p>
        </div>
      )}
    </div>
  )
}

export default SIPComponent
