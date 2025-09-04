import * as React from "react";
import {CalendarDate} from "@internationalized/date";
import {Button} from "@heroui/button";
import {Card, CardBody, CardHeader, CardFooter} from "@heroui/card";
import {Chip} from "@heroui/chip";
import {Input} from "@heroui/input";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@heroui/modal";
import {DatePicker} from "@heroui/date-picker";
import {Pagination} from "@heroui/pagination";

import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/dropdown";
import {Tooltip} from "@heroui/tooltip";
import {Switch} from "@heroui/switch";
import {Spinner} from "@heroui/spinner";
import {
  FaPlus, FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaPlane, FaBus, FaShip, FaHotel, FaWalking,
  FaMoneyBillWave, FaMapMarkerAlt, FaClock, FaCheckCircle, FaListUl, FaTable, FaLayerGroup,
  FaUmbrellaBeach, FaReceipt, FaMoneyCheckAlt, FaGlobeAsia
} from "react-icons/fa";
import { Tabs, Tab } from "@heroui/react";




const WEB_APP_URL = import.meta.env.VITE_THAILAND_TRIPS_API as string;

// ---------- Types ----------
export type Entry = {
  id?: number | string;
  date?: string;
  time?: string;
  activity?: string;
  location?: string;
  transportation?: string;
  costTHB?: string | number;
  costLAK?: string | number;
  paymentStatus?: "yes" | "no";
  checkedIn?: "yes" | "no";
  remarks?: string;
  updatedBy?: string;
  updatedAt?: string;
  [key: string]: any;
};

// ---------- Helpers ----------
const toNum = (v: any) => {
  const n = parseFloat(String(v ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const ddmmyyyyToISO = (d?: string) => {
  if (!d) return "";
  const m = d.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return d;
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
};

const normalize = (row: any): Entry => {
  const e: Entry = {
    id: row.id ?? row.ID ?? row.Id ?? row["ID"],
    date: row.date ?? row.Date,
    time: row.time ?? row.Time,
    activity: row.activity ?? row.Activity,
    location: row.location ?? row.Location,
    transportation: row.transportation ?? row.Transportation,
    costTHB: row.costTHB ?? row.costTHB,
    costLAK: row.costLAK ?? row.costLAK,
    paymentStatus: row.paymentStatus ?? row["Payment Status"] ?? "no",
    checkedIn: row.checkedIn ?? row["Checked In"] ?? "no",
    remarks: row.remarks ?? row.Remarks,
    updatedBy: row.updatedBy ?? row["Updated By"],
    updatedAt: row.updatedAt ?? row["Updated At"],
  };
  return e;
};

const toSheetPayload = (e: Entry) => ({
  id: e.id,
  date: e.date,
  time: e.time,
  activity: e.activity,
  location: e.location,
  transportation: e.transportation,
  costTHB: e.costTHB,
  costLAK: e.costLAK,
  paymentStatus: e.paymentStatus,
  checkedIn: e.checkedIn,
  remarks: e.remarks,
  updatedBy: e.updatedBy || "Unknown User",
});

const TransportIcon: React.FC<{ name?: string }> = ({name}) => {
  const t = (name || "").toLowerCase();
  if (/(plane|flight|air)/.test(t)) return <FaPlane className="text-blue-500"/>;
  if (/bus/.test(t)) return <FaBus className="text-green-500"/>;
  if (/(ship|ferry)/.test(t)) return <FaShip className="text-indigo-500"/>;
  if (/(hotel|stay)/.test(t)) return <FaHotel className="text-amber-500"/>;
  if (/(walk|on foot)/.test(t)) return <FaWalking className="text-gray-500"/>;
  return <FaLayerGroup className="text-purple-500"/>;
};

// ---------- Main Component ----------
export default function ThailandTripApp() {
  const [entries, setEntries] = React.useState<Entry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<"all" | "paid" | "pending" | "checkedin">("all");
  const [view, setView] = React.useState<"cards" | "table" | "board">("cards");
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Entry | null>(null);
  const [date, setDate] = React.useState<CalendarDate | null>(null);
  const [timeRange, setTimeRange] = React.useState("");
  const [dark, setDark] = React.useState(false);
  const [costTHB, setCostTHB] = React.useState("");
  const [costLAK, setCostLAK] = React.useState("");

  const fetchEntries = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(WEB_APP_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const list = Array.isArray(json) ? json : [];
      setEntries(list.map(normalize));
    } catch (e) {
      console.error(e);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const stats = React.useMemo(() => {
    const totalTHB = entries.reduce((s, r) => s + toNum(r.costTHB), 0);
    const totalLAK = entries.reduce((s, r) => s + toNum(r.costLAK), 0);
    const paid = entries.filter(r => r.paymentStatus === "yes").length;
    const pend = entries.filter(r => r.paymentStatus !== "yes").length;
    const checked = entries.filter(r => r.checkedIn === "yes").length;
    return {totalTHB, totalLAK, paid, pend, checked, count: entries.length};
  }, [entries]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = entries.filter(e => {
      if (status === "paid" && e.paymentStatus !== "yes") return false;
      if (status === "pending" && e.paymentStatus === "yes") return false;
      if (status === "checkedin" && e.checkedIn !== "yes") return false;
      if (!q) return true;
      const hay = [e.activity, e.location, e.remarks, e.transportation, e.time, e.date]
        .map(v => String(v ?? "").toLowerCase())
        .join("\n");
      return hay.includes(q);
    });
    return data;
  }, [entries, query, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const openForm = (entry?: Entry) => {
    const e: Entry = entry ? {...entry} : {paymentStatus: "no", checkedIn: "no"};
    setEditing(e);
    const d = e.date ? ddmmyyyyToISO(e.date) : new Date().toISOString().slice(0,10);
    const js = new Date(d);
    setDate(new CalendarDate(js.getFullYear(), js.getMonth() + 1, js.getDate()));
    setTimeRange(e.time || "");
    setCostTHB(String(e.costTHB || ""));
    setCostLAK(String(e.costLAK || ""));
    setModalOpen(true);
  };

  const save = async () => {
    if (!editing) return;
    const d = date ? `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}` : "";
    const payload = toSheetPayload({
      ...editing, 
      date: d, 
      time: timeRange,
      costTHB: costTHB,
      costLAK: costLAK
    });
    
    const action = editing.id ? "update" : "add";
    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({action, ...payload}),
      });
      const out = await res.json();
      if (String(out.status || out.Status).toLowerCase() !== "success") throw new Error(out.message || "Save failed");
      setModalOpen(false);
      setEditing(null);
      await fetchEntries();
    } catch (e) {
      console.error(e);
      alert("Failed to save. Check console.");
    }
  };

  const remove = async (id?: number | string) => {
    if (!id) return;
    if (!confirm("Delete this entry?")) return;
    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({action: "delete", id}),
      });
      const out = await res.json();
      if (String(out.status || out.Status).toLowerCase() !== "success") throw new Error(out.message || "Delete failed");
      await fetchEntries();
    } catch (e) {
      console.error(e);
      alert("Failed to delete. Check console.");
    }
  };

  const checkin = async (e: Entry) => {
    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({action: "update", ...toSheetPayload({...e, checkedIn: "yes"})}),
      });
      const out = await res.json();
      if (String(out.status || out.Status).toLowerCase() !== "success") throw new Error(out.message || "Check-in failed");
      await fetchEntries();
    } catch (err) {
      console.error(err);
      alert("Failed to check in.");
    }
  };

  const StatCard: React.FC<{icon: React.ReactNode; label: string; value: string | number; color: string}> = ({icon, label, value, color}) => (
    <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <CardBody className="flex items-center gap-4 p-5">
        <div className={`rounded-xl p-3 ${color} text-white text-xl`}>
          {icon}
        </div>
        <div>
          <div className="text-sm text-foreground-500 font-medium">{label}</div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
        </div>
      </CardBody>
    </Card>
  );

  const CardView: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {pageItems.map((e) => (
        <Card key={String(e.id)} className="rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
          <div className={`h-2 ${e.paymentStatus === "yes" ? "bg-green-500" : "bg-amber-500"}`}></div>
          <CardHeader className="flex items-start justify-between gap-3 pb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                <TransportIcon name={e.transportation}/>
                <span className="truncate">{e.activity}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-foreground-500 mt-1">
                <FaMapMarkerAlt className="text-xs"/>
                <span className="truncate">{e.location}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Chip size="sm" color={e.paymentStatus === "yes" ? "success" : "warning"} variant="flat">
                {e.paymentStatus === "yes" ? "Paid" : "Pending"}
              </Chip>
              {e.checkedIn === "yes" && (
                <Chip size="sm" color="primary" variant="flat" className="text-xs">Checked In</Chip>
              )}
            </div>
          </CardHeader>
          <CardBody className="py-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <div className="text-foreground-500 font-medium">Date & Time</div>
                <div className="font-semibold">{e.date} • {e.time}</div>
              </div>
              <div className="space-y-1">
                <div className="text-foreground-500 font-medium">Cost</div>
                <div className="font-semibold">
                  {e.costTHB ? `${Number(e.costTHB).toLocaleString()} THB` : ''} 
                  {e.costLAK ? `${Number(e.costLAK).toLocaleString()} LAK` : ''}
                </div>
              </div>
            </div>
            {e.remarks && (
              <div className="mt-3 p-2 bg-content2 rounded-lg">
                <div className="text-xs text-foreground-500 font-medium">Remarks</div>
                <div className="text-sm text-foreground-600">{e.remarks}</div>
              </div>
            )}
          </CardBody>
          <CardFooter className="flex items-center justify-between pt-0">
            <div className="flex gap-2">
              <Tooltip content="Edit">
                <Button isIconOnly variant="flat" size="sm" onPress={() => openForm(e)} className="bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200">
                  <FaEdit/>
                </Button>
              </Tooltip>
              <Tooltip content="Delete" color="danger">
                <Button isIconOnly variant="flat" color="danger" size="sm" onPress={() => remove(e.id)}>
                  <FaTrash/>
                </Button>
              </Tooltip>
            </div>
            {e.checkedIn !== "yes" && (
              <Button size="sm" color="primary" variant="solid" startContent={<FaCheck/>} onPress={() => checkin(e)}>
                Check In
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const TableView: React.FC = () => (
    <Card className="border-0 rounded-2xl shadow-lg overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4">
        <div className="text-lg font-bold flex items-center gap-2">
          <FaUmbrellaBeach /> Thailand Trip Activities
        </div>
      </CardHeader>
      <CardBody className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-foreground-600">
                {["Activity","Date","Time","Location","Transport","Cost","Payment","Status","Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 whitespace-nowrap font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.map((e) => (
                <tr key={String(e.id)} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{e.activity}</td>
                  <td className="px-4 py-3">{e.date}</td>
                  <td className="px-4 py-3">{e.time}</td>
                  <td className="px-4 py-3">{e.location}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <TransportIcon name={e.transportation}/>
                      {e.transportation}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {e.costTHB ? `${Number(e.costTHB).toLocaleString()} THB` : ''} 
                    {e.costLAK ? `${Number(e.costLAK).toLocaleString()} LAK` : ''}
                  </td>
                  <td className="px-4 py-3">
                    <Chip size="sm" color={e.paymentStatus === "yes" ? "success" : "warning"} variant="flat">
                      {e.paymentStatus === "yes" ? "Paid" : "Pending"}
                    </Chip>
                  </td>
                  <td className="px-4 py-3">
                    {e.checkedIn === "yes" ? (
                      <Chip size="sm" color="primary" variant="flat">Checked In</Chip>
                    ) : (
                      <Button size="sm" variant="flat" onPress={() => checkin(e)} className="text-xs">Check In</Button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button isIconOnly size="sm" variant="flat" onPress={() => openForm(e)} className="bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200">
                        <FaEdit/>
                      </Button>
                      <Button isIconOnly size="sm" variant="flat" color="danger" onPress={() => remove(e.id)}>
                        <FaTrash/>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );

  const BoardView: React.FC = () => {
    const lanes = [
      {key: "pending", title: "Pending Payment", icon: FaClock, color: "bg-amber-100 text-amber-700 dark:bg-amber-800/30 dark:text-amber-300", filter: (e: Entry) => e.paymentStatus !== "yes"},
      {key: "paid", title: "Paid", icon: FaCheckCircle, color: "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300", filter: (e: Entry) => e.paymentStatus === "yes"},
      {key: "checked", title: "Checked In", icon: FaCheck, color: "bg-blue-100 text-blue-700 dark:bg-blue-800/30 dark:text-blue-300", filter: (e: Entry) => e.checkedIn === "yes"},
    ] as const;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {lanes.map((lane) => (
          <Card key={lane.key} className="rounded-2xl border-0 shadow-lg overflow-hidden">
            <CardHeader className={`flex items-center justify-between py-3 ${lane.color}`}>
              <div className="flex items-center gap-2 font-semibold">
                <lane.icon />
                <span>{lane.title}</span>
              </div>
              <Chip size="sm" variant="flat">{filtered.filter(lane.filter).length}</Chip>
            </CardHeader>
            <CardBody className="flex flex-col gap-3 p-3 bg-gray-50/50 dark:bg-gray-900/50">
              {filtered.filter(lane.filter).map((e) => (
                <div key={`${lane.key}-${e.id}`} className="rounded-xl border border-content2 p-3 bg-white dark:bg-gray-800 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium flex items-center gap-2">
                      <TransportIcon name={e.transportation}/>
                      {e.activity}
                    </div>
                    <div className="text-xs text-foreground-500">{e.date}</div>
                  </div>
                  <div className="text-xs text-foreground-600 mt-1">{e.location}</div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <div>{e.time}</div>
                    <div className="font-semibold">
                      {e.costTHB ? `${Number(e.costTHB).toLocaleString()} THB` : ''} 
                      {e.costLAK ? `${Number(e.costLAK).toLocaleString()} LAK` : ''}
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2 justify-end">
                    <Button size="sm" variant="flat" onPress={() => openForm(e)} startContent={<FaEdit/>}>Edit</Button>
                    <Button size="sm" variant="flat" color="danger" onPress={() => remove(e.id)} startContent={<FaTrash/>}>Delete</Button>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
                <FaUmbrellaBeach className="text-amber-600" /> 
                Thailand Trip Planner
              </h1>
              <p className="text-foreground-500 mt-1">Plan and track your Thailand adventures with ease</p>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                isSelected={dark}
                onValueChange={setDark}
                size="sm"
              >Dark Mode</Switch>
              <Button 
                color="primary" 
                startContent={<FaPlus/>} 
                onPress={() => openForm()} 
                className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-white shadow-lg"
              >
                Add Activity
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-8">
            <StatCard 
              icon={<FaMoneyBillWave/>} 
              label="Total Cost (THB)" 
              value={`${stats.totalTHB.toLocaleString()}`} 
              color="bg-gradient-to-r from-amber-500 to-amber-600"
            />
            <StatCard 
              icon={<FaMoneyCheckAlt/>} 
              label="Total Cost (LAK)" 
              value={`${stats.totalLAK.toLocaleString()}`} 
              color="bg-gradient-to-r from-green-500 to-green-600"
            />
            <StatCard 
              icon={<FaMapMarkerAlt/>} 
              label="Activities" 
              value={stats.count} 
              color="bg-gradient-to-r from-blue-500 to-blue-600"
            />
            <StatCard 
              icon={<FaReceipt/>} 
              label="Paid" 
              value={stats.paid} 
              color="bg-gradient-to-r from-green-500 to-green-600"
            />
            <StatCard 
              icon={<FaCheckCircle/>} 
              label="Checked In" 
              value={stats.checked} 
              color="bg-gradient-to-r from-purple-500 to-purple-600"
            />
          </div>

          {/* Controls */}
          <Card className="border-0 rounded-2xl shadow-lg mb-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <CardBody className="flex flex-col md:flex-row gap-4 md:items-center p-5">
              <Input
                placeholder="Search activities, locations, remarks..."
                startContent={<FaSearch className="text-foreground-400"/>}
                value={query}
                onChange={(e) => {setPage(1); setQuery(e.target.value);}}
                className="w-full md:max-w-md"
                variant="flat"
              />
              <div className="flex flex-wrap gap-2">
                <Chip onClick={() => setStatus("all")} color={status === "all" ? "primary" : "default"} variant={status === "all" ? "solid" : "flat"} className="cursor-pointer">All</Chip>
                <Chip onClick={() => setStatus("paid")} color={status === "paid" ? "success" : "default"} variant={status === "paid" ? "solid" : "flat"} className="cursor-pointer">Paid</Chip>
                <Chip onClick={() => setStatus("pending")} color={status === "pending" ? "warning" : "default"} variant={status === "pending" ? "solid" : "flat"} className="cursor-pointer">Pending</Chip>
                <Chip onClick={() => setStatus("checkedin")} color={status === "checkedin" ? "primary" : "default"} variant={status === "checkedin" ? "solid" : "flat"} className="cursor-pointer">Checked In</Chip>
              </div>
              <div className="flex items-center gap-3 ml-auto">
               {/* <Tabs
  selectedKey={view}
  onSelectionChange={(key) => {
    setView(key as "cards" | "table" | "board");
  }}
  aria-label="View switcher"
  size="md"
  color="primary"
  variant="bordered"
>
  <Tab 
    key="cards" 
    title={<span className="flex items-center gap-2"><FaLayerGroup/> Cards</span>} 
  />
  <Tab 
    key="table" 
    title={<span className="flex items-center gap-2"><FaTable/> Table</span>} 
  />
  <Tab 
    key="board" 
    title={<span className="flex items-center gap-2"><FaListUl/> Board</span>} 
  />
</Tabs> */}

                <Button variant="flat" startContent={<FaSyncAlt/>} onPress={fetchEntries} className="hidden md:flex">Refresh</Button>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="flat" className="hidden md:flex">Show: {perPage}</Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Per page">
                    {[10, 20, 30, 50].map(n => (
                      <DropdownItem key={n} onPress={() => {setPerPage(n); setPage(1);}}>{n}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </CardBody>
          </Card>

          {/* Content */}
          {loading ? (
            <div className="py-16 grid place-items-center">
              <Spinner size="lg" className="text-amber-500" />
            </div>
          ) : filtered.length === 0 ? (
            <Card className="border-0 rounded-2xl shadow-md bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <CardBody className="py-16 text-center">
                <FaGlobeAsia className="text-4xl text-amber-400 mx-auto mb-3" />
                <div className="text-foreground-500 text-lg">No activities found</div>
                <p className="text-foreground-400 mt-1">Try adjusting your filters or add a new activity</p>
                <Button color="primary" className="mt-4 bg-amber-500" onPress={() => openForm()}>
                  Add Your First Activity
                </Button>
              </CardBody>
            </Card>
          ) : (
            <>
              {view === "cards" && <CardView/>}
              {view === "table" && <TableView/>}
              {view === "board" && <BoardView/>}

              <div className="flex justify-center mt-8">
                <Pagination 
                  total={totalPages} 
                  page={page} 
                  onChange={setPage} 
                  variant="flat" 
                  color="primary"
                  className="shadow-md rounded-full"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Form */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                {editing?.id ? "Edit Activity" : "Add New Activity"}
              </ModalHeader>
              <ModalBody className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Activity" value={editing?.activity || ""} onChange={(e) => setEditing(prev => ({...(prev as Entry), activity: e.target.value}))} isRequired/>
                  <Input label="Location" value={editing?.location || ""} onChange={(e) => setEditing(prev => ({...(prev as Entry), location: e.target.value}))} isRequired/>
                  <DatePicker label="Date" value={date} onChange={setDate} isRequired/>
                  <Input label="Time Range (e.g., 8:00 AM - 10:00 AM)" value={timeRange} onChange={(e) => setTimeRange(e.target.value)} isRequired/>
                  <Input label="Transportation" value={editing?.transportation || ""} onChange={(e) => setEditing(prev => ({...(prev as Entry), transportation: e.target.value}))}/>
                  <Input label="Cost (THB)" type="number" value={costTHB} onChange={(e) => setCostTHB(e.target.value)}/>
                  <Input label="Cost (LAK)" type="number" value={costLAK} onChange={(e) => setCostLAK(e.target.value)}/>
                  <Input label="Remarks" value={editing?.remarks || ""} onChange={(e) => setEditing(prev => ({...(prev as Entry), remarks: e.target.value}))}/>
                </div>
                <div className="mt-4 flex gap-3">
                  <Chip
                    onClick={() => setEditing(prev => ({...(prev as Entry), paymentStatus: "yes"}))}
                    color={editing?.paymentStatus === "yes" ? "success" : "default"}
                    variant={editing?.paymentStatus === "yes" ? "solid" : "flat"}
                    className="cursor-pointer"
                  >Paid</Chip>
                  <Chip
                    onClick={() => setEditing(prev => ({...(prev as Entry), paymentStatus: "no"}))}
                    color={editing?.paymentStatus === "no" ? "warning" : "default"}
                    variant={editing?.paymentStatus === "no" ? "solid" : "flat"}
                    className="cursor-pointer"
                  >Pending</Chip>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Cancel</Button>
                <Button color="primary" onPress={save} className="bg-gradient-to-r from-amber-500 to-orange-500">
                  {editing?.id ? "Update" : "Create"} Activity
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}