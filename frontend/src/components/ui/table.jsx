// frontend/src/components/ui/table.jsx
import * as React from "react"
import { cn } from "@/lib/utils"
const Table = React.forwardRef((props, ref) => <table ref={ref} className={cn("w-full caption-bottom text-sm", props.className)} {...props} />);
const TableHeader = React.forwardRef((props, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", props.className)} {...props} />);
const TableBody = React.forwardRef((props, ref) => <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", props.className)} {...props} />);
const TableRow = React.forwardRef((props, ref) => <tr ref={ref} className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", props.className)} {...props} />);
const TableHead = React.forwardRef((props, ref) => <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground", props.className)} {...props} />);
const TableCell = React.forwardRef((props, ref) => <td ref={ref} className={cn("p-4 align-middle", props.className)} {...props} />);
export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell };