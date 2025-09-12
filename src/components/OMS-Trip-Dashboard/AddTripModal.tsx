import React, { useState } from "react";

interface AddTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

const AddTripModal: React.FC<AddTripModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [form, setForm] = useState<any>(initialData || {
    Date: "",
    Time: "",
    Item: "",
    Location: "",
    Category: "",
    costTHB: 0,
    costLAK: 0,
    paymentStatus: "Pending",
    UpdatedBy: "Tock",
    Remarks: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96">
        <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Trip" : "Add Trip"}</h2>
        <div className="flex flex-col gap-2">
          <input name="Date" type="date" value={form.Date} onChange={handleChange} className="border p-2 rounded"/>
          <input name="Time" type="time" value={form.Time} onChange={handleChange} className="border p-2 rounded"/>
          <input name="Item" placeholder="Item" value={form.Item} onChange={handleChange} className="border p-2 rounded"/>
          <input name="Location" placeholder="Location" value={form.Location} onChange={handleChange} className="border p-2 rounded"/>
          <input name="Category" placeholder="Category" value={form.Category} onChange={handleChange} className="border p-2 rounded"/>
          <input name="costTHB" type="number" placeholder="Cost THB" value={form.costTHB} onChange={handleChange} className="border p-2 rounded"/>
          <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange} className="border p-2 rounded">
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddTripModal;
