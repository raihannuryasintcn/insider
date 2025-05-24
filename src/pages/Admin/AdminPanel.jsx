import React from "react";
import { Tab } from "@headlessui/react";
import { toast } from 'react-toastify';
import {
  UserIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
//@ts-ignore
import UserManagement from '../../components/UserManagement';
//@ts-ignore
import ActivityLogs from '../../components/ActivityLogs';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const AdminPanel = () => {
  return (
    <div className="bg-white p-4 sm:p-6">
      {/* <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-6">
        Admin Panel
      </h2> */}

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-50 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2 text-sm font-medium leading-5 flex items-center justify-center",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                selected
                  ? "bg-white text-blue-700 shadow"
                  : "text-blue-500 hover:bg-white/[0.12] hover:text-blue-600"
              )
            }
          >
            <UserIcon className="h-5 w-5 mr-2" />
            User Management
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2 text-sm font-medium leading-5 flex items-center justify-center",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                selected
                  ? "bg-white text-blue-700 shadow"
                  : "text-blue-500 hover:bg-white/[0.12] hover:text-blue-600"
              )
            }
          >
            <ClockIcon className="h-5 w-5 mr-2" />
            Activity Logs
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <UserManagement />
          </Tab.Panel>

          <Tab.Panel>
            <ActivityLogs />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default AdminPanel;
