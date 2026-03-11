import { useMacroData } from '../hooks/useMacroData';
import './MacroDashboard.css';

export default function MacroDashboard({
    macroState
}: {
    macroState: ReturnType<typeof useMacroData>
}) {
    const { data, loading, error, manualYieldOffset, setManualYieldOffset, currentYield, currentExpectedCapRate } = macroState;

    if (loading) return <div className="macro-dashboard loading">Loading Macro Data...</div>;
    if (error || !data) return <div className="macro-dashboard error">Failed to load Macro Data</div>;

    return (
        <div className="macro-dashboard">
            <h3 className="macro-dashboard__title">Macroeconomic Overlay</h3>

            <div className="macro-dashboard__metric">
                <span className="macro-dashboard__label">US Dollar Index (DXY)</span>
                <span className="macro-dashboard__value">{data.dxy.toFixed(2)}</span>
            </div>

            <div className="macro-dashboard__metric">
                <span className="macro-dashboard__label">Vanguard Real Estate (VNQ)</span>
                <span className="macro-dashboard__value">${data.vnq.toFixed(2)}</span>
            </div>

            <div className="macro-dashboard__divider" />

            <div className="macro-dashboard__scenario">
                <h4 className="macro-dashboard__scenario-title">Scenario Planning (Fed Rates)</h4>

                <div className="macro-dashboard__slider-container">
                    <label className="macro-dashboard__slider-label">
                        10Y Treasury Yield: <span className="highlight">{currentYield.toFixed(2)}%</span>
                        {manualYieldOffset !== 0 && (
                            <span className="offset"> ({manualYieldOffset > 0 ? '+' : ''}{manualYieldOffset.toFixed(2)}%)</span>
                        )}
                    </label>
                    <input
                        type="range"
                        min="-3"
                        max="3"
                        step="0.1"
                        value={manualYieldOffset}
                        onChange={(e) => setManualYieldOffset(parseFloat(e.target.value))}
                        className="macro-dashboard__slider"
                    />
                </div>

                <div className="macro-dashboard__metric highlight-box">
                    <span className="macro-dashboard__label">Target Inst. Cap Rate</span>
                    <span className="macro-dashboard__value">{currentExpectedCapRate.toFixed(2)}%</span>
                </div>
                <p className="macro-dashboard__hint">
                    {currentExpectedCapRate > data.expectedCapRate
                        ? "Rates are rising. Values are falling. Map is redder."
                        : currentExpectedCapRate < data.expectedCapRate
                            ? "Rates are falling. Values are rising. Map is greener."
                            : "Current market conditions."}
                </p>

                {manualYieldOffset !== 0 && (
                    <button
                        className="macro-dashboard__reset"
                        onClick={() => setManualYieldOffset(0)}
                    >
                        Reset to Live ({data.tenYearYield.toFixed(2)}%)
                    </button>
                )}
            </div>
        </div>
    );
}
