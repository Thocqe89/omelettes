import React from "react";

interface Trip {
  ID: string;
  Date: string;
  Time: string;
  Item: string;
  Location: string;
  Category: string;
  costTHB: number;
  costLAK: number;
  paymentStatus: string;
  UpdatedBy: string;
  UpdatedAt: string;
  Remarks: string;
}

interface TripTableProps {
  trips: Trip[];
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
}

const TripTable: React.FC<TripTableProps> = ({ trips, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border border-gray-300 dark:border-gray-600">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Item</th>
            <th>Category</th>
            <th>Cost (THB)</th>
            <th>Payment Status</th>
            <th>Updated By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map(trip => (
            <tr key={trip.ID} className="text-center border-b dark:border-gray-600">
              <td>{trip.ID}</td>
              <td>{trip.Date}</td>
              <td>{trip.Item}</td>
              <td>{trip.Category}</td>
              <td>{trip.costTHB}</td>
              <td>{trip.paymentStatus}</td>
              <td>{trip.UpdatedBy}</td>
              <td className="space-x-2">
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={() => onEdit(trip)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => onDelete(trip.ID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TripTable;
