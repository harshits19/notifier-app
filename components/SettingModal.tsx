"use client"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { useSetting } from "@/hooks/useSetting"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "./ThemeButton"

const SettingModal = () => {
  const settings = useSetting()
  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">My Settings</h2>
        </DialogHeader>
        <div className="flex flex-col gap-y-1">
          <Label>Apperance</Label>
          <span className="text-[0.8rem] text-muted-foreground">
            Customize how Notifier looks on your device
          </span>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default SettingModal
