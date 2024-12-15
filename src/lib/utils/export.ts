import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { utils, write, WorkBook } from 'xlsx';
import { Scholar } from '@/components/Users/UserFrame';

export interface ScholarAttendees {
  id: number;
  firstname: string;
  lastname: string;
  mobilenumber: string;
  age: string;
  yearLevel: string;
  school: {
    name: string;
  };
  barangay: {
    name: string;
  };
  date: string;
}

export const exportData = (data: Scholar[], fileType: 'csv' | 'xlsx' | 'pdf') => {
  const filename = `scholars_export_${new Date().toISOString().split('T')[0]}`;

  const exportData = data.map(scholar => ({
    Lastname: scholar.lastname,
    Firstname: scholar.firstname,
    'Year Level': scholar.yearLevel,
    School: scholar.school.name,
    Barangay: scholar.barangay.name,
    'Return Services': `${scholar.returnServiceCount} / 5`,
    Status: scholar.returnServiceCount >= 5 ? 'Complete' : 'Incomplete'
  }));

  if (fileType === 'csv' || fileType === 'xlsx') {
    const ws = utils.json_to_sheet(exportData);
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, "Scholars");
    const excelBuffer: any = write(wb, { bookType: fileType, type: 'array' });
    const blob = new Blob([excelBuffer], { type: fileType === 'csv' ? 'text/csv;charset=utf-8;' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, `${filename}.${fileType}`);
  } else if (fileType === 'pdf') {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Lastname', 'Firstname', 'Year Level', 'School', 'Barangay', 'Return Services', 'Status']],
      body: exportData.map(row => Object.values(row)),
    });
    doc.save(`${filename}.pdf`);
  }
};

export const exportAttendeesData = (data: ScholarAttendees[], event_name: string, numberattendees: number, fileType: 'csv' | 'xlsx' | 'pdf') => {
  const filename = `scholars_export_${new Date().toISOString().split('T')[0]}`;

  const exportData = data.map(scholar => ({
    'Event': event_name,
    Lastname: scholar.lastname,
    Firstname: scholar.firstname,
    'Year Level': scholar.yearLevel,
    School: scholar.school.name,
    Barangay: scholar.barangay.name,
    'Date': scholar.date,
  }));

  const exportExcelData = data.map(scholar => ({
    'Event': event_name,
    Lastname: scholar.lastname,
    Firstname: scholar.firstname,
    'Year Level': scholar.yearLevel,
    School: scholar.school.name,
    Barangay: scholar.barangay.name,
    'Date': scholar.date,
    'Total Attendees': numberattendees.toString()
  }));

  if (fileType === 'csv' || fileType  === 'xlsx') {
    const ws = utils.json_to_sheet(exportExcelData);
    const wb: WorkBook = utils.book_new();
    utils.book_append_sheet(wb, ws, "Scholars");
    const excelBuffer: any = write(wb, { bookType: fileType, type: 'array' });
    const blob = new Blob([excelBuffer], { type: fileType === 'csv' ? 'text/csv;charset=utf-8;' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, `${filename}.${fileType}`);
  } else if (fileType === 'pdf') {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Event', 'Lastname', 'Firstname', 'Year Level', 'School', 'Barangay', 'Date', '']],
      body: exportData.map(row => Object.values(row)),
      foot: [['Total Attendees','','','','','','', numberattendees.toString()]]
    });
    doc.save(`${filename}.pdf`);
  }
};

