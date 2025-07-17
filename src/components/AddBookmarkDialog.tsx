import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Link,
  Plus,
  X,
  Upload,
  Download,
  Chrome,
  FileText,
  Database,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface AddBookmarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddBookmarkDialog = ({ open, onOpenChange }: AddBookmarkDialogProps) => {
  // Add bookmark states
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [collection, setCollection] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Import/Export states
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    duplicates: number;
  } | null>(null);

  const { toast } = useToast();
  const collections = ["Web Development", "Design", "Technology", "Research"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset form
    setUrl("");
    setTitle("");
    setDescription("");
    setTags([]);
    setNewTag("");
    setCollection("");
    setIsLoading(false);
    onOpenChange(false);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleFileImport = async (file: File, type: string) => {
    setIsImporting(true);
    setImportProgress(0);
    setImportResults(null);

    try {
      // Simulate import progress
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Simulate import results
      const mockResults = {
        success: Math.floor(Math.random() * 50) + 20,
        failed: Math.floor(Math.random() * 5),
        duplicates: Math.floor(Math.random() * 10),
      };

      setImportResults(mockResults);
      toast({
        title: "Import completed",
        description: `Successfully imported ${mockResults.success} bookmarks`,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error importing your bookmarks",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const handleExport = async (format: string) => {
    setIsExporting(true);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create and download file
      const mockData = {
        bookmarks: [
          {
            title: "Beautiful CSS Grid Examples",
            url: "https://cssgrid.io",
            description: "A collection of stunning CSS Grid layouts",
            tags: ["css", "grid", "webdev"],
            collection: "Web Development",
            createdAt: new Date().toISOString(),
          },
        ],
        exportedAt: new Date().toISOString(),
        totalCount: 1,
      };

      const blob = new Blob([JSON.stringify(mockData, null, 2)], {
        type: format === 'json' ? 'application/json' : 'text/csv',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookmarks-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export completed",
        description: `Your bookmarks have been exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your bookmarks",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5 text-primary" />
            Bookmark Manager
          </DialogTitle>
          <DialogDescription>
            Add bookmarks, import data, or export your collection
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="add" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 glass-card border-white/20">
            <TabsTrigger value="add" className="data-[state=active]:bg-white/20">
              <Plus className="h-4 w-4 mr-2" />
              Add Bookmark
            </TabsTrigger>
            <TabsTrigger value="import" className="data-[state=active]:bg-white/20">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </TabsTrigger>
            <TabsTrigger value="export" className="data-[state=active]:bg-white/20">
              <Download className="h-4 w-4 mr-2" />
              Export
            </TabsTrigger>
          </TabsList>

          {/* Add Bookmark Tab */}
          <TabsContent value="add" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="search-glass"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Bookmark title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="search-glass"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add a description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="search-glass min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collection">Collection</Label>
                <Select value={collection} onValueChange={setCollection}>
                  <SelectTrigger className="search-glass">
                    <SelectValue placeholder="Select a collection" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20">
                    {collections.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">+ Create New Collection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="search-glass flex-1"
                  />
                  <Button type="button" onClick={addTag} variant="glass-accent" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-white/10 border-white/20 gap-1"
                      >
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-3 w-3 p-0 hover:bg-white/20"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="glass"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="glass-primary"
                  disabled={!url || isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Saving..." : "Save Bookmark"}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Import Tab */}
          <TabsContent value="import" className="space-y-6">
            {/* Browser Import */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Chrome className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Browser Bookmarks</h3>
                  <p className="text-sm text-muted-foreground">
                    Import bookmarks from Chrome, Firefox, Safari, or Edge
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="browser-file">Select bookmark file</Label>
                  <Input
                    id="browser-file"
                    type="file"
                    accept=".html,.json"
                    className="search-glass mt-2"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileImport(file, 'browser');
                    }}
                    disabled={isImporting}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports HTML bookmark files from all major browsers
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white/10">HTML</Badge>
                  <Badge variant="secondary" className="bg-white/10">JSON</Badge>
                </div>
              </div>
            </Card>

            {/* File Import */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">File Import</h3>
                  <p className="text-sm text-muted-foreground">
                    Import from CSV, JSON, or other bookmark services
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="data-file">Select data file</Label>
                  <Input
                    id="data-file"
                    type="file"
                    accept=".csv,.json,.txt"
                    className="search-glass mt-2"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileImport(file, 'data');
                    }}
                    disabled={isImporting}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports CSV, JSON, and TXT formats
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white/10">CSV</Badge>
                  <Badge variant="secondary" className="bg-white/10">JSON</Badge>
                  <Badge variant="secondary" className="bg-white/10">Pocket</Badge>
                  <Badge variant="secondary" className="bg-white/10">Instapaper</Badge>
                </div>
              </div>
            </Card>

            {/* Import Progress */}
            {isImporting && (
              <Card className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="h-6 w-6 text-primary animate-pulse" />
                  <div>
                    <h3 className="text-lg font-semibold">Importing Bookmarks</h3>
                    <p className="text-sm text-muted-foreground">
                      Please wait while we import your bookmarks...
                    </p>
                  </div>
                </div>
                <Progress value={importProgress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  {importProgress}% complete
                </p>
              </Card>
            )}

            {/* Import Results */}
            {importResults && (
              <Card className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <h3 className="text-lg font-semibold">Import Complete</h3>
                    <p className="text-sm text-muted-foreground">
                      Your bookmarks have been successfully imported
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {importResults.success}
                    </div>
                    <div className="text-sm text-muted-foreground">Imported</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {importResults.duplicates}
                    </div>
                    <div className="text-sm text-muted-foreground">Duplicates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {importResults.failed}
                    </div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            {/* Export Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* JSON Export */}
              <Card className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">JSON Export</h3>
                    <p className="text-sm text-muted-foreground">
                      Export all data in JSON format
                    </p>
                  </div>
                </div>
                <Button
                  variant="glass-primary"
                  onClick={() => handleExport('json')}
                  disabled={isExporting}
                  className="w-full"
                >
                  {isExporting ? "Exporting..." : "Export as JSON"}
                </Button>
              </Card>

              {/* CSV Export */}
              <Card className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">CSV Export</h3>
                    <p className="text-sm text-muted-foreground">
                      Export for spreadsheet applications
                    </p>
                  </div>
                </div>
                <Button
                  variant="glass-primary"
                  onClick={() => handleExport('csv')}
                  disabled={isExporting}
                  className="w-full"
                >
                  {isExporting ? "Exporting..." : "Export as CSV"}
                </Button>
              </Card>

              {/* HTML Export */}
              <Card className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Chrome className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">HTML Export</h3>
                    <p className="text-sm text-muted-foreground">
                      Browser-compatible bookmark file
                    </p>
                  </div>
                </div>
                <Button
                  variant="glass-primary"
                  onClick={() => handleExport('html')}
                  disabled={isExporting}
                  className="w-full"
                >
                  {isExporting ? "Exporting..." : "Export as HTML"}
                </Button>
              </Card>

              {/* Backup Export */}
              <Card className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">Full Backup</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete backup with metadata
                    </p>
                  </div>
                </div>
                <Button
                  variant="glass-primary"
                  onClick={() => handleExport('backup')}
                  disabled={isExporting}
                  className="w-full"
                >
                  {isExporting ? "Creating Backup..." : "Create Backup"}
                </Button>
              </Card>
            </div>

            {/* Export Information */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="h-6 w-6 text-orange-500" />
                <div>
                  <h3 className="text-lg font-semibold">Export Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Important details about your exports
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• JSON exports include all metadata, tags, and collections</p>
                <p>• CSV exports are compatible with Excel and Google Sheets</p>
                <p>• HTML exports can be imported into any browser</p>
                <p>• Full backups include screenshots and cached content</p>
                <p>• All exports are compressed automatically for faster downloads</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};