"use client";
import React, { useReducer, useState, useRef } from "react";

// Simple reducer to manage wizard form state
function formReducer(state, action) {
  switch (action.type) {
    case "update":
      return { ...state, [action.field]: action.value };
    case "bulkUpdate":
      return { ...state, ...action.payload };
    case "reset":
      return action.initial || {};
    default:
      return state;
  }
}

// Initial form state
const initialState = {
  // Step 1
  ownerName: "",
  aadhaar: "",
  pan: "",
  // Step 2
  businessName: "",
  entityType: "Sole Proprietorship",
  dateOfIncorporation: "",
  businessAddress: "",
  // Step 3
  turnover: "",
  investment: "",
  employees: "",
  // Step 4
  accountName: "",
  accountNumber: "",
  ifsc: "",
  // Step 5
  documents: [], // store File objects or names (placeholder)
  // Step 6 - GST
  gstRequired: false,
  gstBusinessPAN: "",
  gstBusinessType: "",
  gstAddressProof: "",
};

export default function RegisterBusinessWizard({ onComplete } = {}) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Basic validation helpers
  const validators = {
    ownerName: (v) => v.trim().length > 0 || "Owner name is required",
    aadhaar: (v) => /^\d{12}$/.test(v) || "Aadhaar must be 12 digits",
    pan: (v) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(v) || "PAN must be 10 alphanumeric characters (e.g. ABCDE1234F)",
    businessName: (v) => v.trim().length > 1 || "Business name is required",
    dateOfIncorporation: (v) => !!v || "Date of incorporation is required",
    businessAddress: (v) => v.trim().length > 5 || "Business address is required",
    accountNumber: (v) => /^\d{9,18}$/.test(v) || "Account number looks invalid",
    ifsc: (v) => /^[A-Z]{4}0[A-Z0-9]{6}$/i.test(v) || "IFSC must be a valid code (e.g. SBIN0000001)",
  };

  function validateStep(currentStep) {
    const stepErrors = {};
    if (currentStep === 1) {
      const owner = validators.ownerName(state.ownerName);
      if (owner !== true) stepErrors.ownerName = owner;
      const aad = validators.aadhaar(state.aadhaar);
      if (aad !== true) stepErrors.aadhaar = aad;
      const pan = validators.pan(state.pan);
      if (pan !== true) stepErrors.pan = pan;
    }
    if (currentStep === 2) {
      const bn = validators.businessName(state.businessName);
      if (bn !== true) stepErrors.businessName = bn;
      const doi = validators.dateOfIncorporation(state.dateOfIncorporation);
      if (doi !== true) stepErrors.dateOfIncorporation = doi;
      const addr = validators.businessAddress(state.businessAddress);
      if (addr !== true) stepErrors.businessAddress = addr;
    }
    if (currentStep === 4) {
      const an = validators.accountNumber(state.accountNumber);
      if (an !== true) stepErrors.accountNumber = an;
      const ifs = validators.ifsc(state.ifsc);
      if (ifs !== true) stepErrors.ifsc = ifs;
    }
    // Step 3 is mostly optional numeric inputs; basic checks
    if (currentStep === 3) {
      if (state.turnover && isNaN(Number(state.turnover))) stepErrors.turnover = "Turnover must be a number";
      if (state.investment && isNaN(Number(state.investment))) stepErrors.investment = "Investment must be a number";
      if (state.employees && (!Number.isInteger(Number(state.employees)) || Number(state.employees) < 0)) stepErrors.employees = "Employees must be a non-negative integer";
    }
    // Step 6 validators
    if (currentStep === 6 && state.gstRequired) {
      const pan = validators.pan(state.gstBusinessPAN);
      if (pan !== true) stepErrors.gstBusinessPAN = "Business PAN must be valid PAN format";
      if (!state.gstBusinessType) stepErrors.gstBusinessType = "Select business type for GST";
      if (!state.gstAddressProof) stepErrors.gstAddressProof = "Provide address proof for GST registration";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }

  function next() {
    if (validateStep(step)) {
      setStep((s) => Math.min(7, s + 1));
    }
  }
  function back() {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  }

  function onFileChange(e) {
    const files = Array.from(e.target.files || []);
    // For now store name placeholders; in real app you'd upload or store File objects
    dispatch({ type: "update", field: "documents", value: files.map((f) => f.name) });
  }

  function toggleGSTRequired(value) {
    dispatch({ type: "update", field: "gstRequired", value });
  }

  function handleSubmitFinal() {
    // In a full app we might persist this to backend here.
    // For now just call onComplete if provided and/or move to summary
    if (onComplete) onComplete(state);
    setStep(7);
  }

  // Small subcomponents for each step
  // refs to track composition state (IME) so we don't break input while composing
  const panComposing = useRef(false);

  // helper dev logger for inputs
  function devInputHandlers(name) {
    if (process.env.NODE_ENV !== 'development') return {};
    return {
      onKeyDown: (e) => console.log(`DEV input ${name} onKeyDown key=${e.key}`),
      onBeforeInput: (e) => console.log(`DEV input ${name} onBeforeInput data=${e.data}`),
      onInput: (e) => console.log(`DEV input ${name} onInput value=${e.target.value}`),
      onCompositionStart: (e) => console.log(`DEV input ${name} compositionstart`),
      onCompositionEnd: (e) => console.log(`DEV input ${name} compositionend value=${e.target.value}`),
    };
  }

  function Step1() {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Step 1 — Basic identity</h2>
        <label className="block mb-2">Owner Name <span className="text-red-600">*</span>
          <input value={state.ownerName} onChange={(e) => dispatch({ type: "update", field: "ownerName", value: e.target.value })} className="mt-1 block w-full rounded border p-2" />
          {errors.ownerName && <p className="text-red-600 text-sm">{errors.ownerName}</p>}
        </label>
        <label className="block mb-2">Aadhaar number <span className="text-red-600">*</span>
          <input value={state.aadhaar} onChange={(e) => dispatch({ type: "update", field: "aadhaar", value: e.target.value.replace(/[^0-9]/g, "") })} maxLength={12} className="mt-1 block w-full rounded border p-2" />
          {errors.aadhaar && <p className="text-red-600 text-sm">{errors.aadhaar}</p>}
        </label>
        <label className="block mb-2">PAN number <span className="text-red-600">*</span>
          <input
            value={state.pan}
            {...devInputHandlers('pan')}
            onCompositionStart={() => (panComposing.current = true)}
            onCompositionEnd={(e) => {
              panComposing.current = false;
              // finalize to uppercase after composition ends
              dispatch({ type: "update", field: "pan", value: e.target.value.toUpperCase() });
            }}
            onChange={(e) => {
              const v = e.target.value;
              if (panComposing.current) {
                // preserve composing value
                dispatch({ type: "update", field: "pan", value: v });
              } else {
                dispatch({ type: "update", field: "pan", value: v.toUpperCase() });
              }
            }}
            maxLength={10}
            className="mt-1 block w-full rounded border p-2"
          />
          {errors.pan && <p className="text-red-600 text-sm">{errors.pan}</p>}
        </label>
        <div className="mt-4">
          <p className="text-sm text-gray-600">We will use these details to pre-fill official forms. Aadhaar/PAN will not be transmitted from this demo UI.</p>
          <p className="text-sm text-gray-600">OTP verification placeholder: <em>Click to simulate</em></p>
          <button type="button" onClick={() => alert("OTP flow placeholder — here you'd call an OTP API") } className="mt-2 bg-gray-200 px-3 py-1 rounded">Simulate OTP</button>
        </div>
      </div>
    );
  }

  function Step2() {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Step 2 — Business details</h2>
        <label className="block mb-2">Business name <span className="text-red-600">*</span>
          <input value={state.businessName} onChange={(e) => dispatch({ type: "update", field: "businessName", value: e.target.value })} className="mt-1 block w-full rounded border p-2" />
          {errors.businessName && <p className="text-red-600 text-sm">{errors.businessName}</p>}
        </label>
        <label className="block mb-2">Type of entity
          <select value={state.entityType} onChange={(e) => dispatch({ type: "update", field: "entityType", value: e.target.value })} className="mt-1 block w-full rounded border p-2">
            <option>Sole Proprietorship</option>
            <option>Partnership</option>
            <option>Pvt Ltd</option>
            <option>LLP</option>
          </select>
        </label>
        <label className="block mb-2">Date of incorporation <span className="text-red-600">*</span>
          <input type="date" value={state.dateOfIncorporation} onChange={(e) => dispatch({ type: "update", field: "dateOfIncorporation", value: e.target.value })} className="mt-1 block w-full rounded border p-2" />
          {errors.dateOfIncorporation && <p className="text-red-600 text-sm">{errors.dateOfIncorporation}</p>}
        </label>
        <label className="block mb-2">Business address <span className="text-red-600">*</span>
          <textarea value={state.businessAddress} onChange={(e) => dispatch({ type: "update", field: "businessAddress", value: e.target.value })} className="mt-1 block w-full rounded border p-2" />
          {errors.businessAddress && <p className="text-red-600 text-sm">{errors.businessAddress}</p>}
        </label>
      </div>
    );
  }

  function Step3() {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Step 3 — Financial details</h2>
        <label className="block mb-2">Estimated annual turnover (INR)
          <input value={state.turnover} onChange={(e) => dispatch({ type: "update", field: "turnover", value: e.target.value })} placeholder="e.g. 500000" className="mt-1 block w-full rounded border p-2" />
          {errors.turnover && <p className="text-red-600 text-sm">{errors.turnover}</p>}
        </label>
        <label className="block mb-2">Investment in plant & equipment (INR)
          <input value={state.investment} onChange={(e) => dispatch({ type: "update", field: "investment", value: e.target.value })} placeholder="e.g. 200000" className="mt-1 block w-full rounded border p-2" />
          {errors.investment && <p className="text-red-600 text-sm">{errors.investment}</p>}
        </label>
        <label className="block mb-2">Number of employees
          <input value={state.employees} onChange={(e) => dispatch({ type: "update", field: "employees", value: e.target.value.replace(/[^0-9]/g, "") })} placeholder="e.g. 5" className="mt-1 block w-full rounded border p-2" />
          {errors.employees && <p className="text-red-600 text-sm">{errors.employees}</p>}
        </label>
      </div>
    );
  }

  function Step4() {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Step 4 — Bank account details</h2>
        <label className="block mb-2">Account name
          <input value={state.accountName} onChange={(e) => dispatch({ type: "update", field: "accountName", value: e.target.value })} className="mt-1 block w-full rounded border p-2" />
        </label>
        <label className="block mb-2">Account number <span className="text-red-600">*</span>
          <input value={state.accountNumber} onChange={(e) => dispatch({ type: "update", field: "accountNumber", value: e.target.value.replace(/[^0-9]/g, "") })} className="mt-1 block w-full rounded border p-2" />
          {errors.accountNumber && <p className="text-red-600 text-sm">{errors.accountNumber}</p>}
        </label>
        <label className="block mb-2">IFSC <span className="text-red-600">*</span>
          <input value={state.ifsc} onChange={(e) => dispatch({ type: "update", field: "ifsc", value: e.target.value.toUpperCase() })} maxLength={11} className="mt-1 block w-full rounded border p-2" />
          {errors.ifsc && <p className="text-red-600 text-sm">{errors.ifsc}</p>}
        </label>
      </div>
    );
  }

  function Step5() {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Step 5 — Upload supporting documents (optional)</h2>
        <p className="text-sm text-gray-600">You can upload incorporation certificate, address proof, identity proof, cancelled cheque etc. (This demo stores filenames locally only.)</p>
        <input type="file" multiple onChange={onFileChange} className="mt-2" />
        <ul className="mt-2 list-disc ml-6">
          {state.documents && state.documents.length === 0 && <li className="text-sm text-gray-500">No files selected</li>}
          {state.documents && state.documents.map((d, i) => <li key={i} className="text-sm">{d}</li>)}
        </ul>
      </div>
    );
  }

  function Step6() {
    // Simple logic: ask if GST required based on turnover threshold or inter-state supply
    const turnoverValue = Number(state.turnover || 0);
    const gstThreshold = 2000000; // Example threshold (2 Lakh for services? note: thresholds vary by business type)

    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Step 6 — GST check</h2>
        <p className="text-sm text-gray-600">GST registration is required if your turnover exceeds the statutory threshold or if you engage in inter-state supply. Use this section to decide if you need GST.</p>
        <div className="mt-3">
          <label className="inline-flex items-center mr-4">
            <input type="radio" name="gst" checked={!state.gstRequired} onChange={() => toggleGSTRequired(false)} />
            <span className="ml-2">I do not need GST</span>
          </label>
          <label className="inline-flex items-center">
            <input type="radio" name="gst" checked={state.gstRequired} onChange={() => toggleGSTRequired(true)} />
            <span className="ml-2">I need GST registration</span>
          </label>
        </div>

        <div className="mt-3 text-sm">
          <p>Detected turnover: INR {turnoverValue.toLocaleString()}</p>
          <p className="text-xs text-gray-500">(This demo uses a simplified threshold of INR {gstThreshold.toLocaleString()}; check official rules for your sector.)</p>
        </div>

        {state.gstRequired && (
          <div className="mt-4">
            <h3 className="font-medium">GST registration details</h3>
            <label className="block mb-2">Business PAN <span className="text-red-600">*</span>
              <input
                value={state.gstBusinessPAN}
                {...devInputHandlers('gstBusinessPAN')}
                onCompositionStart={() => (panComposing.current = true)}
                onCompositionEnd={(e) => {
                  panComposing.current = false;
                  dispatch({ type: "update", field: "gstBusinessPAN", value: e.target.value.toUpperCase() });
                }}
                onChange={(e) => {
                  const v = e.target.value;
                  if (panComposing.current) {
                    dispatch({ type: "update", field: "gstBusinessPAN", value: v });
                  } else {
                    dispatch({ type: "update", field: "gstBusinessPAN", value: v.toUpperCase() });
                  }
                }}
                maxLength={10}
                className="mt-1 block w-full rounded border p-2"
              />
              {errors.gstBusinessPAN && <p className="text-red-600 text-sm">{errors.gstBusinessPAN}</p>}
            </label>
            <label className="block mb-2">Business type for GST
              <select value={state.gstBusinessType} onChange={(e) => dispatch({ type: "update", field: "gstBusinessType", value: e.target.value })} className="mt-1 block w-full rounded border p-2">
                <option value="">Choose</option>
                <option value="Regular">Regular</option>
                <option value="Composition">Composition</option>
                <option value="SEZ">SEZ</option>
              </select>
              {errors.gstBusinessType && <p className="text-red-600 text-sm">{errors.gstBusinessType}</p>}
            </label>
            <label className="block mb-2">Address proof for GST <span className="text-red-600">*</span>
              <input value={state.gstAddressProof} onChange={(e) => dispatch({ type: "update", field: "gstAddressProof", value: e.target.value })} placeholder="e.g. Electricity bill / Rent agreement" className="mt-1 block w-full rounded border p-2" />
              {errors.gstAddressProof && <p className="text-red-600 text-sm">{errors.gstAddressProof}</p>}
            </label>
          </div>
        )}
      </div>
    );
  }

  function Summary() {
    // Checklist for portals
    const checklist = [
      "Owner identity: Aadhaar, PAN",
      "Business details: Name, type, incorporation date, address",
      "Financials: Turnover, investments",
      "Bank details: Account and IFSC",
      "Supporting docs: Incorporation certificate, address proof, cancelled cheque",
    ];

    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Step 7 — Summary & next steps</h2>
  <p className="mb-3">Review the details below. When you&apos;re ready, proceed to the official portals to complete registration. This wizard prepares and validates the information to make the portal filling faster.</p>

        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="font-medium">Collected information</h3>
          <dl className="grid grid-cols-1 gap-2 mt-2">
            <div><strong>Owner:</strong> {state.ownerName} / Aadhaar: {state.aadhaar} / PAN: {state.pan}</div>
            <div><strong>Business:</strong> {state.businessName} ({state.entityType})</div>
            <div><strong>Incorporation:</strong> {state.dateOfIncorporation}</div>
            <div><strong>Address:</strong> {state.businessAddress}</div>
            <div><strong>Turnover:</strong> INR {state.turnover}</div>
            <div><strong>Investment:</strong> INR {state.investment}</div>
            <div><strong>Employees:</strong> {state.employees}</div>
            <div><strong>Bank:</strong> {state.accountName} / {state.accountNumber} / IFSC: {state.ifsc}</div>
            <div><strong>Documents:</strong> {state.documents && state.documents.length ? state.documents.join(", ") : "None"}</div>
            <div><strong>GST required:</strong> {state.gstRequired ? "Yes" : "No"}</div>
            {state.gstRequired && (
              <>
                <div><strong>GST Business PAN:</strong> {state.gstBusinessPAN}</div>
                <div><strong>GST Business Type:</strong> {state.gstBusinessType}</div>
                <div><strong>GST Address proof:</strong> {state.gstAddressProof}</div>
              </>
            )}
          </dl>
        </div>

        <div className="mt-4">
          <h3 className="font-medium">Checklist to keep ready</h3>
          <ul className="list-disc ml-6 mt-2">
            {checklist.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>

        <div className="mt-4 flex gap-3">
          <a className="inline-block bg-blue-600 text-white px-4 py-2 rounded" target="_blank" rel="noreferrer" href="https://udyamregistration.gov.in">Proceed to Udyam Portal</a>
          {state.gstRequired && <a className="inline-block bg-green-600 text-white px-4 py-2 rounded" target="_blank" rel="noreferrer" href="https://www.gst.gov.in">Proceed to GST Portal</a>}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Company / MSME Registration Wizard</h1>
        <p className="text-sm text-gray-600">A guided flow to prepare all details needed for Udyam / GST registration.</p>
      </div>

      <div className="mb-6">
        <div className="mb-2 text-sm">Step {step} of 7</div>
        <div className="w-full bg-gray-200 h-2 rounded">
          <div className="bg-green-500 h-2 rounded" style={{ width: `${(step / 7) * 100}%` }} />
        </div>
      </div>

      <div className="mb-6">
        {step === 1 && Step1()}
        {step === 2 && Step2()}
        {step === 3 && Step3()}
        {step === 4 && Step4()}
        {step === 5 && Step5()}
        {step === 6 && Step6()}
        {step === 7 && Summary()}
      </div>

      <div className="flex justify-between">
        <div>
          {step > 1 && <button onClick={back} className="bg-gray-100 border px-3 py-1 rounded">Back</button>}
        </div>
        <div>
          {step < 7 && <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Next</button>}
          {step === 6 && <button onClick={handleSubmitFinal} className="bg-indigo-600 text-white px-4 py-2 rounded">Review</button>}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">Note: This is a UI-only wizard for preparing information. You will be redirected to official government portals to complete actual registration.</div>
    </div>
  );
}
