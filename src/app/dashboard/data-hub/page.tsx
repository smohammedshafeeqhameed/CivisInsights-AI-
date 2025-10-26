
'use client';

import { useState } from 'react';
import { Upload, List, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

interface UploadedFile {
  name: string;
  size: string;
  status: UploadStatus;
  progress: number;
}

export default function DataHubPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const newFile: UploadedFile = {
      name: selectedFile.name,
      size: (selectedFile.size / 1024).toFixed(2) + ' KB',
      status: 'uploading',
      progress: 0,
    };

    setUploadedFiles((prevFiles) => [newFile, ...prevFiles]);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadedFiles((prevFiles) =>
        prevFiles.map((file) => {
          if (file.name === newFile.name && file.status === 'uploading') {
            const newProgress = file.progress + 10;
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...file, status: 'success', progress: 100 };
            }
            return { ...file, progress: newProgress };
          }
          return file;
        })
      );
    }, 200);

    setSelectedFile(null);
  };
  
  const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'uploading':
        return <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />;
      default:
        return <List className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Data Integration Hub</CardTitle>
          <CardDescription>
            Upload and manage your multi-sectoral datasets. Upload CSV files to
            ingest new data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-lg items-center space-x-2">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <Button onClick={handleUpload} disabled={!selectedFile}>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </CardContent>
        <Separator className="my-4" />
        <CardContent>
          <h3 className="text-sm font-medium mb-2">Sample CSV Format</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Your CSV file should contain the following headers and data structure:
          </p>
          <pre className="bg-muted p-4 rounded-lg text-sm text-muted-foreground overflow-x-auto">
            <code>
{`id,category,report,summary,status
CIV-001,Road Maintenance,"Large pothole on the corner of Main St and 2nd Ave, causing traffic issues.","Pothole at Main & 2nd causing traffic disruption.",New
CIV-002,Public Safety,"Streetlight is out on Elm Street between 3rd and 4th.","Streetlight outage on Elm St.",In Progress
CIV-003,Sanitation,"Public trash can on Oak Ave is overflowing and has not been collected for days.","Overflowing public trash can on Oak Ave.",New`}
            </code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
          <CardDescription>
            Track the status of your recent data uploads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead className="hidden md:table-cell">Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[30%]">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploadedFiles.length > 0 ? (
                uploadedFiles.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{file.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{file.size}</TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                        {getStatusIcon(file.status)}
                        <Badge variant={file.status === 'success' ? 'default' : file.status === 'error' ? 'destructive' : 'secondary'} className='capitalize'>{file.status}</Badge>
                       </div>
                    </TableCell>
                    <TableCell>
                      {file.status === 'uploading' ? (
                         <Progress value={file.progress} className="h-2" />
                      ) : (
                         <div className="text-muted-foreground">-</div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No uploads yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
