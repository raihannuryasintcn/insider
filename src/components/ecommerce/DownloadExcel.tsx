import React, { useState, useEffect } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import { File, Download } from "lucide-react"
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
//@ts-ignore
import { exportISPDataToExcel } from "../../utils/exportUtils"; // Import the export function

export default function DonwloadExcel() {
  const [ispData, setIspData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchISPData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(import.meta.env.VITE_ISP_API_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        setIspData(data);
      } catch (err: any) {
        console.error("Error fetching ISP data:", err);
        setError("Failed to load ISP data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchISPData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <File className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Excel
            </span>
            <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
              Data ISP
            </h4>
            <div className="mt-2">
              <Button
                variant="primary"
                onClick={() =>
                  exportISPDataToExcel(ispData)
                }>
                <Download className="h-4 w-4 mr-2" />
                Unduh
              </Button>
            </div>
          </div>
          <Badge color="success">
            Last updated: 22/10/2023
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
