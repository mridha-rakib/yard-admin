import React, { useEffect, useState } from "react";
import { message } from "antd";
import { ChevronLeft, CheckCircle, XCircle, Pause, Play } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../lib/api/admin-api";
import { getApiErrorMessage } from "../../lib/api/http";
import { formatTime } from "../../lib/time";
import {
  formatAccountStatus,
  formatAvailability,
  formatDate,
  formatFullAddress,
  formatWorkerStatus,
  getAccountStatusClasses,
  getWorkerStatusClasses,
} from "../../lib/workers";

export default function WorkerDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadWorker = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await adminApi.getWorkerById(id);

        if (!ignore) {
          setWorker(data);
        }
      } catch (apiError) {
        if (!ignore) {
          setError(getApiErrorMessage(apiError));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadWorker();

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleAction = async (action) => {
    if (!worker?._id) {
      return;
    }

    setActionLoading(action);

    try {
      let updatedWorker = null;
      let successMessage = "Worker updated successfully.";

      if (action === "approve") {
        updatedWorker = await adminApi.approveWorker(worker._id);
        successMessage = "Worker approved successfully.";
      }

      if (action === "reject") {
        updatedWorker = await adminApi.rejectWorker(worker._id);
        successMessage = "Worker rejected successfully.";
      }

      if (action === "suspend") {
        updatedWorker = await adminApi.updateWorkerAccountStatus(worker._id, "suspended");
        successMessage = "Worker suspended successfully.";
      }

      if (action === "reactivate") {
        updatedWorker = await adminApi.updateWorkerAccountStatus(worker._id, "active");
        successMessage = "Worker reactivated successfully.";
      }

      if (updatedWorker) {
        setWorker(updatedWorker);
        message.success(successMessage);
      }
    } catch (apiError) {
      message.error(getApiErrorMessage(apiError));
    } finally {
      setActionLoading("");
    }
  };

  const handleBack = () => {
    navigate("/workers");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 mt-16 bg-gray-50">
        <div className="p-10 text-center text-gray-500 bg-white rounded-lg shadow-sm">
          Loading worker details...
        </div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="min-h-screen p-6 mt-16 bg-gray-50">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 text-gray-600 transition hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Workers
        </button>
        <div className="p-10 text-center text-red-600 bg-white rounded-lg shadow-sm">
          {error || "Worker not found."}
        </div>
      </div>
    );
  }

  const canApprove = worker.workerStatus !== "approved";
  const canReject = worker.workerStatus !== "rejected";
  const canSuspend = worker.status === "active";
  const canReactivate = worker.status === "suspended" || worker.status === "inactive";

  return (
    <div className="min-h-screen p-6 mt-16 bg-gray-50">
      <div className="mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 text-gray-600 transition hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Workers
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">Personal Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-xs text-gray-500">Full Name</label>
                  <span className="text-sm text-gray-900">{worker.name}</span>
                </div>
                <div>
                  <label className="block mb-1 text-xs text-gray-500">Email</label>
                  <span className="text-sm text-gray-900">{worker.email}</span>
                </div>
                <div>
                  <label className="block mb-1 text-xs text-gray-500">Phone</label>
                  <span className="text-sm text-gray-900">{worker.phone}</span>
                </div>
                <div>
                  <label className="block mb-1 text-xs text-gray-500">Age</label>
                  <span className="text-sm text-gray-900">{worker.age || "Not provided"}</span>
                </div>
                <div>
                  <label className="block mb-1 text-xs text-gray-500">Address</label>
                  <span className="text-sm text-gray-900">
                    {formatFullAddress(worker.location)}
                  </span>
                </div>
                <div>
                  <label className="block mb-1 text-xs text-gray-500">Last Login</label>
                  <span className="text-sm text-gray-900">
                    {formatDate(worker.lastLoginAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">Skills & Availability</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-xs text-gray-500">Services Offered</label>
                  <div className="flex flex-wrap gap-2">
                    {(worker.skills || []).length ? (
                      worker.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-900 text-white"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No skills listed</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-xs text-gray-500">Availability</label>
                    <span className="text-sm text-gray-900">
                      {formatAvailability(worker.availability)}
                    </span>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs text-gray-500">Available Days</label>
                    <span className="text-sm text-gray-900">
                      {worker.availability?.days?.length
                        ? worker.availability.days.join(", ")
                        : "Not provided"}
                    </span>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs text-gray-500">Start Time</label>
                    <span className="text-sm text-gray-900">
                      {formatTime(worker.availability?.startTime) || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs text-gray-500">End Time</label>
                    <span className="text-sm text-gray-900">
                      {formatTime(worker.availability?.endTime) || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-gray-900">Uploaded Documents</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Photo</span>
                    {worker.profilePhotoUrl ? (
                      <a
                        href={worker.profilePhotoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        View
                      </a>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-center overflow-hidden bg-gray-100 rounded-lg aspect-video">
                    {worker.profilePhotoUrl ? (
                      <img
                        src={worker.profilePhotoUrl}
                        alt={worker.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-sm text-gray-500">No profile photo uploaded</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Government ID</span>
                    {worker.idDocumentUrl ? (
                      <a
                        href={worker.idDocumentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        View
                      </a>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-center overflow-hidden bg-gray-100 rounded-lg aspect-video">
                    {worker.idDocumentUrl ? (
                      <div className="px-6 text-sm text-center text-gray-700">
                        Document uploaded. Use the View link to open it.
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No ID document uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky p-6 space-y-6 bg-white rounded-lg shadow-sm top-6">
              <div>
                <h2 className="mb-4 text-lg font-bold text-gray-900">Worker Overview</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block mb-1 text-xs text-gray-500">Application Status</label>
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${getWorkerStatusClasses(
                        worker.workerStatus
                      )}`}
                    >
                      {formatWorkerStatus(worker.workerStatus)}
                    </span>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs text-gray-500">Account Status</label>
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${getAccountStatusClasses(
                        worker.status
                      )}`}
                    >
                      {formatAccountStatus(worker.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs text-gray-500">Applied On</label>
                    <span className="text-sm text-gray-900">{formatDate(worker.createdAt)}</span>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs text-gray-500">Updated On</label>
                    <span className="text-sm text-gray-900">{formatDate(worker.updatedAt)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-lg font-bold text-gray-900">Admin Actions</h2>
                <div className="space-y-3">
                  {canApprove ? (
                    <button
                      onClick={() => handleAction("approve")}
                      disabled={Boolean(actionLoading)}
                      className="flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm font-medium text-white transition bg-green-600 rounded-lg hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {actionLoading === "approve" ? "Approving..." : "Approve Worker"}
                    </button>
                  ) : null}

                  {canReject ? (
                    <button
                      onClick={() => handleAction("reject")}
                      disabled={Boolean(actionLoading)}
                      className="flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm font-medium text-white transition bg-red-600 rounded-lg hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <XCircle className="w-4 h-4" />
                      {actionLoading === "reject" ? "Rejecting..." : "Reject Worker"}
                    </button>
                  ) : null}

                  {canSuspend ? (
                    <button
                      onClick={() => handleAction("suspend")}
                      disabled={Boolean(actionLoading)}
                      className="flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm font-medium text-gray-900 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Pause className="w-4 h-4" />
                      {actionLoading === "suspend" ? "Suspending..." : "Suspend Worker"}
                    </button>
                  ) : null}

                  {canReactivate ? (
                    <button
                      onClick={() => handleAction("reactivate")}
                      disabled={Boolean(actionLoading)}
                      className="flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm font-medium text-gray-900 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Play className="w-4 h-4" />
                      {actionLoading === "reactivate" ? "Reactivating..." : "Reactivate Worker"}
                    </button>
                  ) : null}

                  {!canApprove && !canReject && !canSuspend && !canReactivate ? (
                    <div className="text-sm text-gray-500">No actions available for this worker.</div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
