import * as React from "react";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Spinner,
  Progress,
  Pagination,
  Image,
  Input,
  Slider
} from "@heroui/react";
import { Tabs, Tab } from "@heroui/tabs";
import { Select, SelectItem } from "@heroui/select";
import { 
  FaSyncAlt, 
  FaWhatsapp, 
  FaPlus, 
  FaReceipt,
  FaFilter,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaHome,
  FaEdit,
  FaTrash,
  FaChartLine,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUser,
  FaShareAlt
} from "react-icons/fa";
import { 
  FiCreditCard, 
  FiPieChart, 
  FiDollarSign, 
  FiCalendar,
  FiUser as FiUserIcon
} from "react-icons/fi";
import dayjs from "dayjs";
import DefaultLayout from "@/layouts/default";
import { addToast } from "@heroui/toast";
import CountUp from "react-countup";
import AnimatedNumber from "./AnimatedNumber";
import OMS_Loading from "./oms_loading";

const OMS_TRIP_URL = import.meta.env.VITE_OMS_TIRP;

interface OMS_TripEntry {
  id: string;
  date: string;
  time: string;
  item: string;
  location: string;
  category: string;
  costTHB: string;
  costLAK: string;
  paymentStatus: string;
  updatedBy: string;
  updatedAt: string;
  remarks: string;
  phone?: string;
  sharedDetails?: string;
}

interface SharedExpenseDetail {
  user: string;
  amount: number;
  percentage: number;
}

interface SharedExpense {
  totalAmount: number;
  shares: SharedExpenseDetail[];
}

// Form steps configuration
const formSteps = [
  { title: "Basic Information", fields: ["date", "time", "item", "location"] },
  { title: "Financial Details", fields: ["costTHB", "costLAK", "category", "paymentStatus"] },
  { title: "Additional Info", fields: ["remarks", "updatedBy"] }
];

interface FormField {
  label: string;
  type: "text" | "number" | "date" | "time" | "select";
  required: boolean;
  icon?: React.ReactNode;
}

// Form field configuration
const formFields: Record<string, FormField> = {
  date: { label: "Date", type: "date", required: true, icon: <FiCalendar /> },
  time: { label: "Time", type: "time", required: true },
  item: { label: "Item", type: "text", required: true },
  location: { label: "Location", type: "text", required: false, icon: <FaFilter /> },
  costTHB: { label: "Cost (THB)", type: "number", required: false, icon: <FiDollarSign /> },
  costLAK: { label: "Cost (LAK)", type: "number", required: false },
  category: { label: "Category", type: "select", required: false },
  paymentStatus: { label: "Payment Status", type: "select", required: false },
  remarks: { label: "Remarks", type: "text", required: false },
  updatedBy: { label: "Updated By", type: "select", required: true }
};

// User options
const userOptions = [
  { key: "all", label: "All Users", avatar: "A" },
  { key: "Tock", label: "Tock", avatar: "T" },
  { key: "Khun", label: "Khun", avatar: "K" },
];

// Payment status options
const paymentStatusOptions = [
  { key: "paid", label: "Paid" },
  { key: "pending", label: "Pending" },
  { key: "share", label: "Share" },
];

// Category options
const categoryOptions = [
  { key: "Food", label: "Food" },
  { key: "Transport", label: "Transport" },
  { key: "Accommodation", label: "Accommodation" },
  { key: "Shopping", label: "Shopping" },
  { key: "Entertainment", label: "Entertainment" },
  { key: "Miscellaneous", label: "Miscellaneous" },
];

// Updated category colors with brand colors
const categoryColors: Record<string, string> = {
  Food: "bg-[#301934]/10 text-[#301934] border-[#301934]/20",
  Transport: "bg-[#0d7a68]/10 text-[#0d7a68] border-[#0d7a68]/20",
  Accommodation: "bg-[#301934]/15 text-[#301934] border-[#301934]/25",
  Shopping: "bg-[#0d7a68]/15 text-[#0d7a68] border-[#0d7a68]/25",
  Entertainment: "bg-[#301934]/20 text-[#301934] border-[#301934]/30",
  Miscellaneous: "bg-gray-100 text-gray-800 border-gray-200",
};

// Share modal component
const ShareExpenseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (sharedExpense: SharedExpense) => void;
  totalAmount: number;
}> = ({ isOpen, onClose, onSave, totalAmount }) => {
  const [shares, setShares] = React.useState<SharedExpenseDetail[]>([
    { user: 'Tock', amount: totalAmount / 2, percentage: 50 },
    { user: 'Khun', amount: totalAmount / 2, percentage: 50 }
  ]);

  React.useEffect(() => {
    // Update amounts when total changes
    const updatedShares = shares.map(share => ({
      ...share,
      amount: Math.round((totalAmount * share.percentage) / 100)
    }));
    setShares(updatedShares);
  }, [totalAmount]);

  const handlePercentageChange = (index: number, percentage: number) => {
    const newShares = [...shares];
    newShares[index].percentage = percentage;
    
    // Adjust other shares to maintain 100% total
    const otherIndex = index === 0 ? 1 : 0;
    newShares[otherIndex].percentage = 100 - percentage;
    
    // Update amounts
    newShares[index].amount = Math.round((totalAmount * percentage) / 100);
    newShares[otherIndex].amount = Math.round((totalAmount * (100 - percentage)) / 100);
    
    setShares(newShares);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <FaShareAlt className="text-[#301934]" />
          Share Expense
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-sm font-semibold text-blue-800 text-center">
                Total Amount: ฿{totalAmount.toLocaleString()}
              </p>
            </div>
            
            {shares.map((share, index) => (
              <div key={share.user} className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#301934]">{share.user}</span>
                  <span className="font-bold text-lg">฿{share.amount.toLocaleString()}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Percentage</span>
                    <span className="font-semibold">{share.percentage}%</span>
                  </div>
                  
                  <Slider
                    value={share.percentage}
                    onChange={(value) => {
                      // If value is an array, use the first element; otherwise use value directly
                      const percent = Array.isArray(value) ? value[0] : value;
                      handlePercentageChange(index, percent);
                    }}
                    color="primary"
                    className="max-w-md"
                  />
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-[#301934] text-white" 
            onPress={() => onSave({ totalAmount, shares })}
          >
            Confirm Shares
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Mobile responsive components
const MobileTableRow: React.FC<{ entry: OMS_TripEntry; onEdit: (entry: OMS_TripEntry) => void }> = ({ entry, onEdit }) => {
  const categoryColor = categoryColors[entry.category] || categoryColors.Miscellaneous;
  const [showSharedDetails, setShowSharedDetails] = React.useState(false);
  
  let sharedDetails = null;
  try {
    sharedDetails = entry.sharedDetails ? JSON.parse(entry.sharedDetails) : null;
  } catch (e) {
    console.error("Error parsing shared details:", e);
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-3 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {entry.item}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
            <FaFilter size={10} className="mr-1" /> 
            {entry.location || "No location"}
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${categoryColor} ml-2 flex-shrink-0`}>
          {entry.category || "Miscellaneous"}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
        <div>
          <div className="text-gray-600 dark:text-gray-400">Date/Time</div>
          <div className="text-gray-900 dark:text-white font-medium">
            {entry.date ? dayjs(entry.date).format("DD/MM/YY") : "N/A"}
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            {entry.time ? dayjs(entry.time, "HH:mm:ss").format("h:mm A") : ""}
          </div>
        </div>
        
        <div>
          <div className="text-gray-600 dark:text-gray-400">Amount</div>
          {entry.costTHB && (
            <div className="text-gray-900 dark:text-white font-medium">
              {parseFloat(entry.costTHB).toLocaleString()} ฿
            </div>
          )}
          {entry.costLAK && (
            <div className="text-gray-500 dark:text-gray-400">
              {parseFloat(entry.costLAK).toLocaleString()} ₭
            </div>
          )}
        </div>
      </div>
      
      {entry.paymentStatus === 'share' && sharedDetails && (
        <div className="mb-3 p-2 bg-blue-50 rounded-lg">
          <button 
            onClick={() => setShowSharedDetails(!showSharedDetails)}
            className="text-xs text-blue-600 font-medium flex items-center gap-1"
          >
            <FaShareAlt size={10} />
            {showSharedDetails ? 'Hide Shares' : 'Show Shares'}
          </button>
          
          {showSharedDetails && (
            <div className="mt-2 space-y-1">
              {sharedDetails.shares.map((share: SharedExpenseDetail, index: number) => (
                <div key={index} className="flex justify-between text-xs">
                  <span>{share.user}:</span>
                  <span className="font-semibold">฿{share.amount.toLocaleString()}</span>
                  <span>({share.percentage}%)</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <Chip
            variant="flat"
            size="sm"
            color={
              entry.paymentStatus === "paid" ? "success" : 
              entry.paymentStatus === "share" ? "primary" : "warning"
            }
            className="text-xs"
          >
            {entry.paymentStatus || "Unknown"}
          </Chip>
          <div className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex items-center">
            <FiUserIcon size={10} className="mr-1" /> {entry.updatedBy}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            isIconOnly
            variant="light"
            onPress={() => onEdit(entry)}
            className="text-[#301934] hover:bg-[#301934]/10"
          >
            <FaEdit size={12} />
          </Button>
          
          {entry.phone && (
            <Button
              size="sm"
              isIconOnly
              variant="flat"
              as="a"
              href={`https://wa.me/${entry.phone}`}
              target="_blank"
              className="text-[#0d7a68] hover:bg-[#0d7a68]/10"
            >
              <FaWhatsapp size={12} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const ToastNotification: React.FC<{ 
  message: string; 
  isVisible: boolean; 
  onClose: () => void;
  type?: 'success' | 'error';
}> = ({ message, isVisible, onClose, type = 'success' }) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in max-w-[calc(100vw-2rem)]">
      <div className={`flex items-center p-4 rounded-xl shadow-lg ${
        type === 'success' 
          ? 'bg-[#0d7a68] text-white' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        <FaCheckCircle className={`text-lg mr-3 ${type === 'success' ? 'text-white' : 'text-red-600'}`} />
        <span className="font-medium text-sm">{message}</span>
        <button 
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

const SuccessPage: React.FC<{ 
  onBackToDashboard: () => void;
  onAddAnother: () => void;
  expenseData: Partial<OMS_TripEntry>;
}> = ({ onBackToDashboard, onAddAnother, expenseData }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-[#0d7a68] text-white p-4 rounded-full mb-5">
        <FaCheckCircle size={48} />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
        Expense Submitted Successfully!
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-5 text-sm">
        Your expense has been recorded and saved to the database.
      </p>
      
      <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl w-full mb-5">
        <h3 className="font-semibold text-sm mb-4 text-gray-800 dark:text-white">Expense Details</h3>
        <div className="space-y-3 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Item:</span>
            <span className="font-medium text-[#301934] dark:text-white">{expenseData.item || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Amount:</span>
            <span className="font-medium text-[#301934] dark:text-white">
              {expenseData.costTHB ? `${expenseData.costTHB} THB` : ""}
              {expenseData.costTHB && expenseData.costLAK ? " / " : ""}
              {expenseData.costLAK ? `${expenseData.costLAK} LAK` : ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Category:</span>
            <span className="font-medium text-[#301934] dark:text-white">{expenseData.category || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Added by:</span>
            <span className="font-medium text-[#301934] dark:text-white">{expenseData.updatedBy || "N/A"}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button
          className="flex-1 bg-[#301934] hover:bg-[#4a2d4e] text-white text-sm h-12"
          onPress={onBackToDashboard}
          startContent={<FaHome />}
        >
          Back to Dashboard
        </Button>
        <Button
          variant="bordered"
          onPress={onAddAnother}
          startContent={<FaPlus />}
          className="flex-1 border-[#301934] text-[#301934] hover:bg-[#301934] hover:text-white text-sm h-12"
          autoFocus
        >
          Add Another Expense
        </Button>
      </div>
    </div>
  );
};

const StatsCard: React.FC<{
  title: string;
  value: string | number | React.ReactNode;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}> = ({ title, value, subtitle, icon, color, trend }) => (
  <Card className="bg-white dark:bg-gray-800 shadow-md border-none rounded-xl overflow-hidden">
    <CardBody className="flex flex-row items-center p-5">
      <div className={`p-3 rounded-xl mr-4 ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{title}</p>
        <p className="text-xl font-bold text-gray-800 dark:text-white mt-1 truncate">{value}</p>
        <div className="flex items-center justify-between mt-2">
          <p className={`text-xs ${trend ? 'mr-2' : ''}`}>{subtitle}</p>
          {trend && (
            <span className={`text-xs flex items-center ${
              trend.isPositive ? 'text-[#0d7a68]' : 'text-red-500'
            }`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>
    </CardBody>
  </Card>
);

const CategoryProgress: React.FC<{
  category: string;
  amount: number;
  total: number;
  count: number;
  currency: string;
}> = ({ category, amount, total, count, currency }) => {
  const percentage = total > 0 ? (amount / total) * 100 : 0;
  const colorClass = categoryColors[category] || categoryColors.Miscellaneous;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-800 dark:text-white">{category}</span>
        <span className="text-sm font-semibold text-[#301934] dark:text-[#0d7a68]">
          {amount.toLocaleString()} {currency}
        </span>
      </div>
      <Progress 
        value={percentage} 
        className="h-2"
        classNames={{
          indicator: colorClass.split(' ')[0].replace('bg-', ''),
          track: "bg-gray-200 dark:bg-gray-700"
        }}
      />
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">{count} expenses</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
};

export default function OMSDashboard() {
  const [entries, setEntries] = React.useState<OMS_TripEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [formData, setFormData] = React.useState<Partial<OMS_TripEntry>>({});
  const [isEditing, setIsEditing] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState("all");
  const [selectedUser, setSelectedUser] = React.useState("all");
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");
  const [toastType, setToastType] = React.useState<'success' | 'error'>('success');
  const [currentStep, setCurrentStep] = React.useState(0);
  const [showSuccessPage, setShowSuccessPage] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(10);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [sharedExpense, setSharedExpense] = React.useState<SharedExpense | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  // Check screen size
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(OMS_TRIP_URL);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const rawData: any = await res.json();

      // Check if the response has an error
      if (rawData && typeof rawData === 'object' && 'status' in rawData && rawData.status === 'error') {
        throw new Error(rawData.message || 'Error fetching data');
      }

      // Normalize keys
      let data: OMS_TripEntry[] = rawData.map((row: any) => {
        const normalized: any = {};
        Object.keys(row).forEach((key) => {
          const cleanKey = key.trim().replace(/\s+/g, '');
          normalized[cleanKey.charAt(0).toLowerCase() + cleanKey.slice(1)] = row[key];
        });
        return normalized;
      });

      setEntries(data.reverse());
    } catch (err) {
      console.error('Error fetching:', err);
      showNotification(
        err instanceof Error ? err.message : 'Error fetching data. Please try again.', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    addToast({
      title: type === 'success' ? 'Success' : 'Error',
      description: message,
      color: type === 'success' ? 'success' : 'danger',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let requestData: any = {
        method: isEditing ? 'edit' : 'add',
        ...formData
      };

      // Add shared expense details if payment status is "share"
      if (formData.paymentStatus === 'share' && sharedExpense) {
        requestData = {
          ...requestData,
          sharedDetails: JSON.stringify(sharedExpense),
          costTHB: sharedExpense.totalAmount.toString(),
        };
      }

      // For edit operations, include the ID
      if (isEditing && editId) {
        requestData.id = editId;
      }

      console.log('Submitting data:', requestData);

      const response = await fetch(OMS_TRIP_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (result.status === 'success') {
        showNotification(
          isEditing ? 'Expense updated successfully!' : 'Expense added successfully!'
        );
        setShowSuccessPage(true);
        fetchData();
        
        setTimeout(() => {
          setShowSuccessPage(false);
          onOpenChange();
          setSharedExpense(null);
        }, 1500);
      } else {
        showNotification(`Error saving expense: ${result.message}`, 'error');
      }
    } catch (err) {
      console.error('Error saving:', err);
      showNotification('Error saving expense. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (entry: OMS_TripEntry) => {
    setFormData({
      date: entry.date,
      time: entry.time,
      item: entry.item,
      location: entry.location,
      category: entry.category,
      costTHB: entry.costTHB,
      costLAK: entry.costLAK,
      paymentStatus: entry.paymentStatus,
      updatedBy: entry.updatedBy,
      remarks: entry.remarks
    });
    
    if (entry.sharedDetails) {
      try {
        setSharedExpense(JSON.parse(entry.sharedDetails));
      } catch (e) {
        console.error("Error parsing shared details:", e);
        setSharedExpense(null);
      }
    }
    
    setEditId(entry.id);
    setIsEditing(true);
    onOpen();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const response = await fetch(OMS_TRIP_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          method: 'delete',
          id: id
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        showNotification('Expense deleted successfully!');
        fetchData();
      } else {
        showNotification(`Error deleting expense: ${result.message}`, 'error');
      }
    } catch (err) {
      console.error('Error deleting:', err);
      showNotification('Error deleting expense. Please try again.', 'error');
    }
  };

  const cancelEdit = () => {
    setFormData({});
    setIsEditing(false);
    setEditId(null);
    setCurrentStep(0);
    setShowSuccessPage(false);
    setSharedExpense(null);
    onOpenChange();
  };

  const nextStep = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackToDashboard = () => {
    setFormData({});
    setIsEditing(false);
    setEditId(null);
    setCurrentStep(0);
    setShowSuccessPage(false);
    setSharedExpense(null);
    onOpenChange();
  };

  const handleAddAnother = () => {
    setFormData({});
    setCurrentStep(0);
    setShowSuccessPage(false);
    setSharedExpense(null);
  };

  // Calculate totals
  const totalTHB = entries.reduce((sum, e) => sum + (parseFloat(e.costTHB) || 0), 0);
  const totalLAK = entries.reduce((sum, e) => sum + (parseFloat(e.costLAK) || 0), 0);
  
  // Calculate totals for filtered user
  const filteredUserEntries = selectedUser === "all" 
    ? entries 
    : entries.filter(entry => entry.updatedBy === selectedUser);
  
  const userTotalTHB = filteredUserEntries.reduce((sum, e) => sum + (parseFloat(e.costTHB) || 0), 0);
  const userTotalLAK = filteredUserEntries.reduce((sum, e) => sum + (parseFloat(e.costLAK) || 0), 0);
  const userTotalExpenses = filteredUserEntries.length;
  
  // Calculate today's expenses
  const today = dayjs();
  const todayExpensesTHB = entries
    .filter(e => dayjs(e.date).isSame(today, 'day'))
    .reduce((sum, e) => sum + (parseFloat(e.costTHB) || 0), 0);
  const todayExpensesLAK = entries
    .filter(e => dayjs(e.date).isSame(today, 'day'))
    .reduce((sum, e) => sum + (parseFloat(e.costLAK) || 0), 0);

  // Calculate yesterday's expenses for trend
  const yesterday = dayjs().subtract(1, 'day');
  const yesterdayExpensesTHB = entries
    .filter(e => dayjs(e.date).isSame(yesterday, 'day'))
    .reduce((sum, e) => sum + (parseFloat(e.costTHB) || 0), 0);
  
  const thbTrend = yesterdayExpensesTHB > 0 
    ? ((todayExpensesTHB - yesterdayExpensesTHB) / yesterdayExpensesTHB) * 100 
    : 0;

  // Calculate category breakdown
  const categoryBreakdown = entries.reduce((acc, entry) => {
    const category = entry.category || "Miscellaneous";
    if (!acc[category]) {
      acc[category] = { THB: 0, LAK: 0, count: 0 };
    }
    acc[category].THB += parseFloat(entry.costTHB) || 0;
    acc[category].LAK += parseFloat(entry.costLAK) || 0;
    acc[category].count += 1;
    return acc;
  }, {} as Record<string, { THB: number; LAK: number; count: number }>);

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    const categoryMatch = activeTab === "all" || entry.category === activeTab;
    const userMatch = selectedUser === "all" || entry.updatedBy === selectedUser;
    return categoryMatch && userMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, endIndex);

  // Prepare tabs
  const tabItems = [
    { key: "all", label: "All Expenses" },
    ...Object.keys(categoryBreakdown).map(category => ({
      key: category,
      label: category
    }))
  ];

  // Quick actions functions
  const handleExportReport = () => {
    showNotification('Export feature coming soon!', 'success');
  };

  const handleMonthlySummary = () => {
    showNotification('Monthly summary feature coming soon!', 'success');
  };

  const handleUserStatistics = () => {
    showNotification('User statistics feature coming soon!', 'success');
  };

  return (
    <DefaultLayout>
      <ToastNotification 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)}
        type={toastType}
      />
      
      {isSubmitting && <OMS_Loading />}
      
      <div className="min-h-screen pt-2 p-2 bg-gradient-to-br from-[#301934]/5 to-indigo-50/30 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto space-y-5">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col items-start md:items-start gap-2 w-full">
              <div className="flex justify-center md:justify-start w-full">
                <Image
                  isBlurred
                  alt="Trip Expense Tracker Logo"
                  src="https://res.cloudinary.com/deahgtn57/image/upload/v1757230873/omelett%27s/public/logo/oms-t-logo/oms-t_llufta.png"
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain dark:hidden"
                />
                <Image
                  alt="Trip Expense Tracker Logo Dark"
                  src="https://res.cloudinary.com/deahgtn57/image/upload/v1757230875/omelett%27s/public/logo/oms-t-logo/oms-t-dark_nhaye9.png"
                  className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain hidden dark:block"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full mt-3 md:mt-0">
              <div className="flex gap-2 flex-wrap items-center w-full sm:w-auto">
                <Button
                  onPress={onOpen}
                  className="bg-[#301934] hover:bg-[#4a2d4e] text-white text-sm h-10"
                  size={isMobile ? "sm" : "md"}
                  startContent={<FaPlus />}
                >
                  <span className="hidden sm:inline">Add Expense</span>
                  <span className="sm:hidden">Add</span>
                </Button>

                <Select
                  selectedKeys={new Set([selectedUser])}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    setSelectedUser(selectedKey);
                  }}
                  className="min-w-[120px]"
                  size="sm"
                >
                  {userOptions.map((user) => (
                    <SelectItem key={user.key}>
                      {user.label}
                    </SelectItem>
                  ))}
                </Select>

                <Button
                  onPress={fetchData}
                  variant="flat"
                  size={isMobile ? "sm" : "md"}
                  className="h-10"
                  startContent={
                  isLoading ? <OMS_Loading /> : <FaSyncAlt />
                  }
                  isDisabled={isLoading}
                >
                  {isLoading && isMobile ? "" : "Refresh"}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title={selectedUser === "all" ? "Total THB" : "User THB"}
              value={
                <>
                  <span>฿ </span>
                  <AnimatedNumber value={selectedUser === "all" ? totalTHB : userTotalTHB} />
                </>
              }
              subtitle={`Today: ฿${todayExpensesTHB.toLocaleString()}`}
              icon={<FiDollarSign className="text-[#301934] text-xl" />}
              color="bg-[#301934]/10"
              trend={{ value: thbTrend, isPositive: thbTrend >= 0 }}
            />
            
            <StatsCard
              title={selectedUser === "all" ? "Total LAK" : "User LAK"}
              value={
                <>
                  <span>₭ </span>
                  <AnimatedNumber value={selectedUser === "all" ? totalLAK : userTotalLAK} />
                </>
              }
              subtitle={`Today: ₭${todayExpensesLAK.toLocaleString()}`}
              icon={<FiCreditCard className="text-[#0d7a68] text-xl" />}
              color="bg-[#0d7a68]/10"
            />
            
            <StatsCard
              title={selectedUser === "all" ? "Expenses" : "User Expenses"}
              value={<AnimatedNumber value={selectedUser === "all" ? entries.length : userTotalExpenses} />}
              subtitle={`${Object.keys(categoryBreakdown).length} categories`}
              icon={<FaReceipt className="text-[#301934] text-xl" />}
              color="bg-[#301934]/10"
            />
            
            <StatsCard
              title="Last Updated"
              value={entries[0] ? dayjs(entries[0].updatedAt).format("MMM DD") : "N/A"}
              subtitle={`By ${entries[0]?.updatedBy || "Unknown"}`}
              icon={<FiCalendar className="text-[#0d7a68] text-xl" />}
              color="bg-[#0d7a68]/10"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-5">
            {/* Left Column - Categories & Analytics */}
            {!isMobile && (
              <div className="lg:w-80 flex-shrink-0 space-y-5">
                <Card className="bg-white dark:bg-gray-800 shadow-md border-none rounded-2xl">
                  <CardHeader className="flex flex-row items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700 px-5 pt-5">
                    <FiPieChart className="text-[#301934]" />
                    <span className="text-md font-bold text-gray-800 dark:text-white">Spending by Category</span>
                  </CardHeader>
                  <CardBody className="px-5 pb-5 pt-4">
                    {Object.entries(categoryBreakdown)
                      .sort((a, b) => b[1].THB - a[1].THB)
                      .map(([category, data]) => (
                        <CategoryProgress
                          key={category}
                          category={category}
                          amount={data.THB}
                          total={totalTHB}
                          count={data.count}
                          currency="฿"
                        />
                      ))}
                  </CardBody>
                </Card>

                <Card className="bg-white dark:bg-gray-800 shadow-md border-none rounded-2xl">
                  <CardHeader className="flex flex-row items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700 px-5 pt-5">
                    <FaChartLine className="text-[#0d7a68]" />
                    <span className="text-md font-bold text-gray-800 dark:text-white">Quick Actions</span>
                  </CardHeader>
                  <CardBody className="p-5">
                    <div className="space-y-3">
                      <Button 
                        fullWidth 
                        className="justify-start h-12 bg-[#301934]/5 hover:bg-[#301934]/10 text-[#301934]"
                        startContent={<FaMoneyBillWave />}
                        onPress={handleExportReport}
                      >
                        Export Report
                      </Button>
                      <Button 
                        fullWidth 
                        className="justify-start h-12 bg-[#0d7a68]/5 hover:bg-[#0d7a68]/10 text-[#0d7a68]"
                        startContent={<FaCalendarAlt />}
                        onPress={handleMonthlySummary}
                      >
                        View Monthly Summary
                      </Button>
                      <Button 
                        fullWidth 
                        className="justify-start h-12 bg-gray-100 hover:bg-gray-200 text-gray-700"
                        startContent={<FaUser />}
                        onPress={handleUserStatistics}
                      >
                        User Statistics
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* Right Column - Main Content */}
            <div className="flex-1">
              {/* Tabs */}
              <Card className="bg-white dark:bg-gray-800 shadow-md border-none rounded-2xl mb-4">
                <CardBody className="p-0">
                  <Tabs 
                    selectedKey={activeTab} 
                    onSelectionChange={(key) => {
                      setActiveTab(key as string);
                      setCurrentPage(1);
                    }}
                    aria-label="Expense categories"
                    classNames={{
                      tabList: "px-4 pt-4 pb-0",
                      cursor: "bg-[#301934]",
                      tab: "data-[selected=true]:text-[#301934]"
                    }}
                  >
                    {tabItems.map((item) => (
                      <Tab key={item.key} title={item.label} />
                    ))}
                  </Tabs>
                </CardBody>
              </Card>

              {/* Entries */}
              <Card className="bg-white dark:bg-gray-800 shadow-md border-none rounded-2xl">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 dark:border-gray-700 py-4 px-5">
                  <div>
                    <span className="text-lg font-bold text-gray-800 dark:text-white">Expense Records</span>
                    {selectedUser !== "all" && (
                      <span className="ml-2 text-xs text-[#301934] dark:text-[#e7c3ee]">
                        ({userOptions.find(u => u.key === selectedUser)?.label})
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
                    {startIndex + 1}-{Math.min(endIndex, filteredEntries.length)} of {filteredEntries.length}
                  </span>
                </CardHeader>
                <CardBody className="p-0">
                  {loading ? (
                    <div className="p-8 flex justify-center">
                      <Spinner size="lg" />
                    </div>
                  ) : filteredEntries.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <FaReceipt className="text-4xl mx-auto mb-3 text-gray-300" />
                      <p>No expenses found.</p>
                      <p className="text-sm mt-1">
                        {selectedUser !== "all" ? "Try changing filters." : "Add your first expense!"}
                      </p>
                    </div>
                  ) : isMobile ? (
                    // Mobile view
                    <div className="p-4">
                      {paginatedEntries.map((e) => (
                        <MobileTableRow key={e.id} entry={e} onEdit={handleEdit} />
                      ))}
                    </div>
                  ) : (
                    // Desktop view
                    <>
                      <Table aria-label="Expenses table" removeWrapper className="min-w-full">
                        <TableHeader>
                          <TableColumn className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-xs font-semibold px-5 py-3">DATE/TIME</TableColumn>
                          <TableColumn className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-xs font-semibold px-5 py-3">ITEM & LOCATION</TableColumn>
                          <TableColumn className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-xs font-semibold px-5 py-3">COSTS</TableColumn>
                          <TableColumn className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-xs font-semibold px-5 py-3">STATUS & USER</TableColumn>
                          <TableColumn className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 text-xs font-semibold px-5 py-3">ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {paginatedEntries.map((e) => {
                            const categoryColor = categoryColors[e.category] || categoryColors.Miscellaneous;
                            let sharedDetails = null;
                            try {
                              sharedDetails = e.sharedDetails ? JSON.parse(e.sharedDetails) : null;
                            } catch (error) {
                              console.error("Error parsing shared details:", error);
                            }
                            
                            return (
                              <TableRow key={e.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <TableCell className="px-5 py-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {e.date ? dayjs(e.date).format("DD/MM/YYYY") : "N/A"}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {e.time ? dayjs(e.time, "HH:mm:ss").format("h:mm A") : ""}
                                  </div>
                                </TableCell>
                                <TableCell className="px-5 py-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{e.item}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                                    <FaFilter size={10} /> {e.location || "No location"}
                                  </div>
                                  <div className="mt-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${categoryColor}`}>
                                      {e.category || "Miscellaneous"}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="px-5 py-4">
                                  {e.costTHB && (
                                    <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                      <CountUp end={parseFloat(e.costTHB)} duration={1.2} separator="," />
                                      <span className="text-[#301934]">฿</span>
                                    </div>
                                  )}
                                  {e.costLAK && (
                                    <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                      <CountUp end={parseFloat(e.costLAK)} duration={1.2} separator="," />
                                      <span className="text-[#0d7a68]">₭</span>
                                    </div>
                                  )}
                                  {e.paymentStatus === 'share' && sharedDetails && (
                                    <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                                      <div className="text-xs text-blue-700 font-medium flex items-center gap-1">
                                        <FaShareAlt size={10} />
                                        Shared Expense
                                      </div>
                                      <div className="mt-1 space-y-1">
                                        {sharedDetails.shares.map((share: SharedExpenseDetail, index: number) => (
                                          <div key={index} className="flex justify-between text-xs">
                                            <span>{share.user}:</span>
                                            <span className="font-semibold">฿{share.amount.toLocaleString()}</span>
                                            <span>({share.percentage}%)</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell className="px-5 py-4">
                                  <Chip
                                    variant="flat"
                                    color={
                                      e.paymentStatus === "paid" ? "success" : 
                                      e.paymentStatus === "share" ? "primary" : "warning"
                                    }
                                    size="sm"
                                  >
                                    {e.paymentStatus || "Unknown"}
                                  </Chip>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                                    <FiUserIcon size={10} /> {e.updatedBy}
                                  </div>
                                  {e.phone && (
                                    <div className="mt-2">
                                      <Button
                                        size="sm"
                                        variant="flat"
                                        as="a"
                                        href={`https://wa.me/${e.phone}`}
                                        target="_blank"
                                        className="text-[#0d7a68] hover:bg-[#0d7a68]/10"
                                        startContent={<FaWhatsapp size={12} />}
                                      >
                                        Contact
                                      </Button>
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell className="px-5 py-4">
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      isIconOnly
                                      variant="light"
                                      onPress={() => handleEdit(e)}
                                      className="text-[#301934] hover:bg-[#301934]/10"
                                    >
                                      <FaEdit size={14} />
                                    </Button>
                                    <Button
                                      size="sm"
                                      isIconOnly
                                      variant="light"
                                      onPress={() => handleDelete(e.id)}
                                      className="text-red-500 hover:bg-red-500/10"
                                    >
                                      <FaTrash size={14} />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </>
                  )}
                  
                  {/* Pagination Controls */}
                  {filteredEntries.length > itemsPerPage && (
                    <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredEntries.length)} of {filteredEntries.length}
                      </div>
                      <Pagination
                        total={totalPages}
                        page={currentPage}
                        onChange={setCurrentPage}
                        color="primary"
                        size="sm"
                        showControls={!isMobile}
                        className="gap-1"
                      />
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </div>

        {/* Add/Edit Expense Modal */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={isMobile ? "full" : "2xl"} placement={isMobile ? "bottom" : "auto"}>
          <ModalContent>
            {(_onClose) => (
              <>
                {showSuccessPage ? (
                  <SuccessPage 
                    onBackToDashboard={handleBackToDashboard}
                    onAddAnother={handleAddAnother}
                    expenseData={formData}
                  />
                ) : (
                  <>
                    <ModalHeader className="flex flex-col gap-1 border-b border-gray-200 dark:border-gray-700 px-6 pt-6 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold">{isEditing ? "Edit Expense" : "Add Expense"}</span>
                        <span className="text-sm text-gray-500">Step {currentStep + 1} of {formSteps.length}</span>
                      </div>
                      <Progress 
                        value={(currentStep + 1) * (100 / formSteps.length)} 
                        className="mt-3"
                        size="sm"
                        classNames={{ indicator: "bg-[#301934]" }}
                      />
                    </ModalHeader>
                    <ModalBody className="py-5 px-6">
                      <form id="expense-form" onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {formSteps[currentStep].fields.map((fieldId) => {
                            const field = formFields[fieldId as keyof typeof formFields];
                            
                            if (field.type === "select") {
                              if (fieldId === "category") {
                                return (
                                  <div key={fieldId} className="flex flex-col">
                                    <label className="text-sm font-medium text-foreground-500 mb-2 flex items-center gap-2">
                                      {field.icon && field.icon}
                                      {field.label} {field.required && <span className="text-danger">*</span>}
                                    </label>
                                    <Select
                                      selectedKeys={formData[fieldId as keyof OMS_TripEntry] ? new Set([formData[fieldId as keyof OMS_TripEntry] as string]) : new Set()}
                                      onSelectionChange={(keys) => {
                                        const selectedKey = Array.from(keys)[0] as string;
                                        setFormData({ ...formData, [fieldId]: selectedKey });
                                      }}
                                      className="w-full"
                                      size="sm"
                                    >
                                      {categoryOptions.map((option) => (
                                        <SelectItem key={option.key}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </Select>
                                  </div>
                                );
                              } else if (fieldId === "paymentStatus") {
                                return (
                                  <div key={fieldId} className="flex flex-col">
                                    <label className="text-sm font-medium text-foreground-500 mb-2 flex items-center gap-2">
                                      {field.icon && field.icon}
                                      {field.label} {field.required && <span className="text-danger">*</span>}
                                    </label>
                                    <Select
                                      selectedKeys={formData[fieldId as keyof OMS_TripEntry] ? new Set([formData[fieldId as keyof OMS_TripEntry] as string]) : new Set()}
                                      onSelectionChange={(keys) => {
                                        const selectedKey = Array.from(keys)[0] as string;
                                        setFormData({ ...formData, [fieldId]: selectedKey });
                                        
                                        // Reset shared expense when payment status changes
                                        if (selectedKey !== 'share') {
                                          setSharedExpense(null);
                                        }
                                      }}
                                      className="w-full"
                                      size="sm"
                                    >
                                      {paymentStatusOptions.map((option) => (
                                        <SelectItem key={option.key}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </Select>
                                  </div>
                                );
                              } else if (fieldId === "updatedBy") {
                                return (
                                  <div key={fieldId} className="flex flex-col">
                                    <label className="text-sm font-medium text-foreground-500 mb-2 flex items-center gap-2">
                                      {field.icon && field.icon}
                                      {field.label} {field.required && <span className="text-danger">*</span>}
                                    </label>
                                    <Select
                                      selectedKeys={formData[fieldId as keyof OMS_TripEntry] ? new Set([formData[fieldId as keyof OMS_TripEntry] as string]) : new Set()}
                                      onSelectionChange={(keys) => {
                                        const selectedKey = Array.from(keys)[0] as string;
                                        setFormData({ ...formData, [fieldId]: selectedKey });
                                      }}
                                      className="w-full"
                                      size="sm"
                                    >
                                      {userOptions.filter(u => u.key !== "all").map((user) => (
                                        <SelectItem key={user.key}>
                                          {user.label}
                                        </SelectItem>
                                      ))}
                                    </Select>
                                  </div>
                                );
                              }
                            }
                            
                            return (
                              <div key={fieldId} className="flex flex-col">
                                <label className="text-sm font-medium text-foreground-500 mb-2 flex items-center gap-2">
                                  {field.icon && field.icon}
                                  {field.label} {field.required && <span className="text-danger">*</span>}
                                </label>
                                <Input
                                  id={fieldId}
                                  type={field.type}
                                  value={formData[fieldId as keyof OMS_TripEntry] as string || ""}
                                  onChange={(e) => setFormData({ ...formData, [fieldId]: e.target.value })}
                                  className="w-full"
                                  size="sm"
                                  required={field.required}
                                  placeholder={`Enter ${field.label.toLowerCase()}`}
                                />
                              </div>
                            );
                          })}
                        </div>

                        {/* Share configuration section */}
                        {formData.paymentStatus === 'share' && (
                          <div className="col-span-2 mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                                <FaShareAlt />
                                Expense Sharing
                              </h4>
                              <Button
                                onPress={() => setIsShareModalOpen(true)}
                                size="sm"
                                className="bg-[#301934] text-white"
                              >
                                Configure Shares
                              </Button>
                            </div>
                            
                            {sharedExpense ? (
                              <div className="space-y-2">
                                <p className="text-sm text-blue-700">
                                  Total: ฿{sharedExpense.totalAmount.toLocaleString()}
                                </p>
                                {sharedExpense.shares.map((share, index) => (
                                  <div key={index} className="flex justify-between text-sm bg-white p-2 rounded-lg">
                                    <span>{share.user}</span>
                                    <span className="font-semibold">฿{share.amount.toLocaleString()}</span>
                                    <span className="text-blue-600">({share.percentage}%)</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-blue-600">
                                Click "Configure Shares" to set how this expense should be divided.
                              </p>
                            )}
                          </div>
                        )}
                      </form>
                    </ModalBody>
                    <ModalFooter className="border-t border-gray-200 dark:border-gray-700 pt-5 pb-6 px-6">
                      <div className="flex justify-between w-full">
                        <Button 
                          color="default" 
                          variant="light" 
                          onPress={currentStep === 0 ? cancelEdit : prevStep}
                          size="md"
                          startContent={currentStep === 0 ? undefined : <FaArrowLeft />}
                          className="h-11"
                        >
                          {currentStep === 0 ? "Cancel" : "Back"}
                        </Button>
                        
                        {currentStep < formSteps.length - 1 ? (
                          <Button 
                            className="bg-[#301934] text-white hover:bg-[#4a2d4e] h-11" 
                            onPress={nextStep} 
                            size="md"
                            endContent={<FaArrowRight />}
                          >
                            Next
                          </Button>
                        ) : (
                          <Button 
                            className="bg-[#301934] text-white hover:bg-[#4a2d4e] h-11" 
                            type="submit" 
                            form="expense-form" 
                            size="md"
                            endContent={<FaCheck />}
                            isLoading={isSubmitting}
                            isDisabled={formData.paymentStatus === 'share' && !sharedExpense}
                          >
                            {isEditing ? "Update" : "Save"} Expense
                          </Button>
                        )}
                      </div>
                    </ModalFooter>
                  </>
                )}
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Share Expense Modal */}
        <ShareExpenseModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onSave={(sharedData) => {
            setSharedExpense(sharedData);
            setIsShareModalOpen(false);
          }}
          totalAmount={parseFloat(formData.costTHB as string) || 0}
        />
      </div>
       <div className="mt-8 w-80 mx-auto" data-aos="zoom-in">
          <div className="h-1 w-full bg-[#0d7a68]" />
        </div>
    </DefaultLayout>
  );
}