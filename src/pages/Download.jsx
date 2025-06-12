import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { exportISPDataToExcel } from "../utils/exportUtils";
import { Download, FileText } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"

export default function DownloadComponent() {
    const [ispData, setIspData] = useState([]);

    useEffect(() => {
        const fetchISPData = async () => {
            const primaryUrl = import.meta.env.VITE_ISP_API_URL;
            const fallbackUrl = "http://localhost:3000/api/isp";

            try {
                let response;

                // Coba server env dulu (jika ada)
                if (primaryUrl) {
                    try {
                        response = await fetch(primaryUrl);
                        if (!response.ok) {
                            throw new Error(`Primary server error: ${response.status}`);
                        }
                    } catch (primaryError) {
                        console.log("Primary server failed, trying localhost...", primaryError.message);
                        // Jika server env gagal, coba localhost
                        response = await fetch(fallbackUrl);
                        if (!response.ok) {
                            throw new Error(`Fallback server error: ${response.status}`);
                        }
                    }
                } else {
                    // Jika tidak ada env, langsung ke localhost
                    response = await fetch(fallbackUrl);
                    if (!response.ok) {
                        throw new Error(`Localhost server error: ${response.status}`);
                    }
                }

                const data = await response.json();
                setIspData(data);
            } catch (err) {
                console.error("All servers failed:", err);
                // Optional: set error state atau default data
                // setError("Failed to load ISP data");
            }
        };

        fetchISPData();
    }, []);

    return (<>

        <Card className="mb-4">
            <CardHeader>

                <CardTitle>
                    <div className="flex">
                        <FileText className="h-4 w-4" />
                        <span className="ml-2">ISP Data</span>
                    </div>
                </CardTitle>
                <CardDescription>Format: Microsoft Excel (.xlsx)</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button onClick={() => exportISPDataToExcel(ispData)}>
                    <Download className="h-4 w-4" />
                    Download
                </Button>
            </CardFooter>
        </Card>
        <div className="flex justify-end">

        </div>
    </>
    );
}