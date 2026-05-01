export default function TaskCard({ task, onUpdate, onDelete, isAdmin }) {
  const statusColors = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    "in-progress": "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200"
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-4 flex justify-between items-start transition-all hover:shadow-md">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
           <h3 className="text-lg font-bold text-gray-800">{task.title}</h3>
           <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${statusColors[task.status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
            {task.status.replace("-", " ")}
          </span>
        </div>
        
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{task.description}</p>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Project:</span>
            <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{task.projectId?.name || "N/A"}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Due:</span>
            <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}</span>
          </div>

          {!isAdmin && (
             <div className="flex items-center gap-1.5">
             <span className="text-gray-400">Assignee:</span>
             <span className="text-gray-700">{task.assignedTo?.name || "Me"}</span>
           </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-2 ml-4">
        {isAdmin ? (
          <button 
            className="bg-white text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 border border-red-100 transition-colors"
            onClick={() => onDelete(task._id)}
          >
            Delete
          </button>
        ) : (
          task.status !== "completed" && (
            <button 
              className="bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-600 shadow-sm transition-all"
              onClick={() => onUpdate(task._id, "completed")}
            >
              Mark Complete
            </button>
          )
        )}
        
        {!isAdmin && task.status === "pending" && (
            <button 
              className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 border border-blue-100 transition-colors"
              onClick={() => onUpdate(task._id, "in-progress")}
            >
              Start Task
            </button>
        )}
      </div>
    </div>
  );
}
