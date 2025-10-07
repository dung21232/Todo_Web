import React from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";
import { Circle } from "lucide-react";
import { Input } from "./ui/input";
import { Calendar } from "lucide-react";
import { SquarePen } from "lucide-react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useState } from "react";
import { use } from "react";

const TaskCard = ({ task, index, handleTaskChanged }) => {
  const [isEditTing, setIsEditTing] = useState(false);
  const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || "");

  const deleteTask = async (taskId) => {
    const confirmed = confirm("Bạn có chắc muốn xoá nhiệm vụ này không?");
    if (!confirmed) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success(" Nhiệm vụ xoá thành công");
      handleTaskChanged();
    } catch (error) {
      console.error(" Lỗi xảy ra khi xoá", error);
      toast.error(" Lỗi xảy ra khi xoá nhiệm vụ");
    }
  };

  const updateTask = async () => {
    try {
      setIsEditTing(false);
      await api.put(`/tasks/${task._id}`, {
        title: updateTaskTitle
      });
      toast.success(`Nhiệm vụ đã đổi thành ${updateTaskTitle}`)
      handleTaskChanged();
    } catch (error) {
       console.error(" Lỗi xảy ra khi update", error);
      toast.error(" Lỗi xảy ra khi cập nhật nhiệm vụ");
    }
  }

  const toggleTaskCompleteButton = async () => {
    try {
      if(task.status === 'active') {
        await api.put(`/tasks/${task._id}`, {
            status: 'complete',
           completedAt: new Date().toISOString()
        })
         
        toast.success(`${task.title} đã hoàn thành.`)
      }else {
        await api.put(`/tasks/${task._id}`, {
          status: 'active',
          completedAt: null
        })

        toast.success(`${task.title} đã đổi sang chưa hoàn thành.`)
      }
      handleTaskChanged();
    } catch (error) {
       console.error(" Lỗi xảy ra khi update", error);
      toast.error(" Lỗi xảy ra khi cập nhật nhiệm vụ");
    }
  }

    const handleKeyPress = (event) => {
    if(event.key === 'Enter') {
      updateTask();
    }
  }
  return (
    <Card
      className={cn(
        "p-4 gb-greadient-cardd border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
        task.status === "complete" && "opacity-75"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* Nút tròn   */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "flex-shrink-0 size-8 rounded-full transition-all duration-200",
            task.status === "complete"
              ? "text-success hover:text-success/80"
              : "text-muted-foreground hover:text-primary"
          )}
          onClick={toggleTaskCompleteButton}
        >
          {task.status === "complete" ? (
            <CheckCircle className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
        </Button>

        {/* hiển thị hoặc chỉnh sửa tiêu đề */}
        <div className="flex-1 min-w-0">
          {isEditTing? (
            <Input
              placeholder="Cần phải làm gì?"
              className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
              type="text"
              value={updateTaskTitle}
              onChange={(e) => setUpdateTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={() => {
                setIsEditTing(false);
                setUpdateTaskTitle(task.title || "");
              }}
            />
          ) : (
            <p
              className={cn(
                "text-base transition-all duration-200",
                task.status === "complete"
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              )}
            >
              {task.title}
            </p>
          )}

          {/* ngày tạo & ngày hoàn thành */}
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleString()}
            </span>
            {task.completedAt && (
              <>
                <span className="text-xs text-muted-foreground"> - </span>
                <Calendar className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {new Date(task.completedAt).toLocaleString()}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Nút chỉnh và xoá  */}
        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
          {/* nút edit */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-info"
            onClick={() => {
              setIsEditTing(true);
              setUpdateTaskTitle(task.title || "")
            }}
          >
            <SquarePen className="size-4" />
          </Button>

          {/* nút delete */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive"
            onClick={() => deleteTask(task._id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
