import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const FilterPanel = ({
  filters,
  setFilters,
  resetFilters,
  getUniqueValues,
  setShowFilterPanel,
}) => {
  const filterOptions = [
    {
      key: "is_jartup",
      label: "JARTUP",
      options: [
        { value: "true", label: "Ya" }, // Terjemahkan
        { value: "false", label: "Tidak" }, // Terjemahkan
      ],
    },
    {
      key: "is_jartaplok",
      label: "JARTAPLOK",
      options: [
        { value: "true", label: "Ya" }, // Terjemahkan
        { value: "false", label: "Tidak" }, // Terjemahkan
      ],
    },
    {
      key: "internal_risk_profile",
      label: "Profil Risiko", // Terjemahkan
      options: getUniqueValues("internal_risk_profile").map(val => ({
        value: val,
        label: val
      })),
    },
    {
      key: "collection_rate",
      label: "Tingkat Koleksi", // Terjemahkan
      options: getUniqueValues("collection_rate").map(val => ({
        value: val,
        label: val
      })),
    },
    {
      key: "coverage_customer",
      label: "Cakupan Pelanggan", // Terjemahkan
      options: getUniqueValues("coverage_customer").map(val => ({
        value: val,
        label: val
      })),
    },
    {
      key: "headquarters",
      label: "Wilayah", // Terjemahkan
      options: getUniqueValues("headquarters")
        .sort((a, b) => {
          const numA = parseInt(a.replace("TR", ""));
          const numB = parseInt(b.replace("TR", ""));
          return numA - numB;
        })
        .map(val => ({
          value: val,
          label: val
        })),
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Filter</CardTitle> {/* Terjemahkan */}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {filterOptions.map(({ key, label, options }) => (
            <div key={key}>
              <Select
                value={filters[key] || ""}
                onValueChange={(value) => handleFilterChange(key, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={label} />
                </SelectTrigger>
                <SelectContent>
                  {options.map(({ value, label: optionLabel }) => (
                    <SelectItem key={value} value={value}>
                      {optionLabel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          onClick={resetFilters}
          variant="outline"
        >
          Reset Filter {/* Terjemahkan */}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FilterPanel;