import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-media-tab',
  templateUrl: './media-tab.component.html',
  styleUrls: ['./media-tab.component.css']
})
export class MediaTabComponent implements OnInit {
  @Input() parentForm!: FormGroup;
  @ViewChild('photoFileInput') photoFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('floorFileInput') floorFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('docFileInput') docFileInput!: ElementRef<HTMLInputElement>;
  
  // UI state tracking
  isPhotoDragOver: boolean = false;
  isFloorDragOver: boolean = false;
  isDocDragOver: boolean = false;
  showPhotoError: boolean = false;
  showFloorError: boolean = false;
  showDocError: boolean = false;

  // Media previews
  imagePreviews: string[] = [];
  floorPreviews: string[] = [];
  documentPreviews: string[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Initialize the media form structure if it doesn't exist
    this.initializeFormArrays();
    
    // Load existing previews from form data
    this.loadExistingPreviews();
  }

  // Initialize form arrays if they don't exist
  initializeFormArrays() {
    // Check if we're dealing with a nested form or direct form
    const mediaGroup = this.parentForm.get('media') as FormGroup;
    
    if (mediaGroup) {
      // Initialize arrays within media group
      if (!mediaGroup.contains('photos')) {
        mediaGroup.addControl('photos', this.fb.array([]));
      }
      
      if (!mediaGroup.contains('floorPlans')) {
        mediaGroup.addControl('floorPlans', this.fb.array([]));
      }
      
      if (!mediaGroup.contains('documents')) {
        mediaGroup.addControl('documents', this.fb.array([]));
      }
      
      if (!mediaGroup.contains('videos')) {
        mediaGroup.addControl('videos', this.fb.array([]));
      }
      
      if (!mediaGroup.contains('virtualTours')) {
        mediaGroup.addControl('virtualTours', this.fb.array([]));
      }
    } else {
      // Initialize arrays directly on the parent form
      if (!this.parentForm.contains('photos')) {
        this.parentForm.addControl('photos', this.fb.array([]));
      }
      
      if (!this.parentForm.contains('floorPlans')) {
        this.parentForm.addControl('floorPlans', this.fb.array([]));
      }
      
      if (!this.parentForm.contains('documents')) {
        this.parentForm.addControl('documents', this.fb.array([]));
      }
      
      if (!this.parentForm.contains('videos')) {
        this.parentForm.addControl('videos', this.fb.array([]));
      }
      
      if (!this.parentForm.contains('virtualTours')) {
        this.parentForm.addControl('virtualTours', this.fb.array([]));
      }
    }
  }

  // Load existing previews from form data
  loadExistingPreviews() {
    // Load photo previews
    if (this.photosArray && this.photosArray.length) {
      this.imagePreviews = this.photosArray.controls.map(control => {
        const value = control.value;
        return value.preview || '';
      });
    }
    
    // Load floor plan previews
    if (this.floorPlansArray && this.floorPlansArray.length) {
      this.floorPreviews = this.floorPlansArray.controls.map(control => {
        const value = control.value;
        return value.preview || '';
      });
    }
    
    // Load document previews
    if (this.documentsArray && this.documentsArray.length) {
      this.documentPreviews = this.documentsArray.controls.map(control => {
        const value = control.value;
        return value.preview || '';
      });
    }
    
    // Update error flags based on loaded data
    this.showPhotoError = this.imagePreviews.length === 0;
    this.showFloorError = this.floorPreviews.length === 0;
    this.showDocError = this.documentPreviews.length === 0;
  }

  // Form controls getters that handle both direct and nested form structures
  get photosArray(): FormArray {
    const mediaGroup = this.parentForm.get('media');
    return mediaGroup ? 
      (mediaGroup.get('photos') as FormArray) : 
      (this.parentForm.get('photos') as FormArray);
  }
  
  get floorPlansArray(): FormArray {
    const mediaGroup = this.parentForm.get('media');
    return mediaGroup ? 
      (mediaGroup.get('floorPlans') as FormArray) : 
      (this.parentForm.get('floorPlans') as FormArray);
  }
  
  get documentsArray(): FormArray {
    const mediaGroup = this.parentForm.get('media');
    return mediaGroup ? 
      (mediaGroup.get('documents') as FormArray) : 
      (this.parentForm.get('documents') as FormArray);
  }
  
  get videosArray(): FormArray {
    const mediaGroup = this.parentForm.get('media');
    return mediaGroup ? 
      (mediaGroup.get('videos') as FormArray) : 
      (this.parentForm.get('videos') as FormArray);
  }
  
  get virtualToursArray(): FormArray {
    const mediaGroup = this.parentForm.get('media');
    return mediaGroup ? 
      (mediaGroup.get('virtualTours') as FormArray) : 
      (this.parentForm.get('virtualTours') as FormArray);
  }
  
  get videos(): any[] {
    return this.videosArray.controls.map(control => control.value);
  }
  
  get virtualTours(): any[] {
    return this.virtualToursArray.controls.map(control => control.value);
  }

  // Photo section handlers
  triggerPhotoFileInput() {
    this.photoFileInput.nativeElement.click();
  }

  onPhotoFileSelect(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) this.processPhotoFiles(files);
  }

  onPhotoDragOver(event: DragEvent) {
    event.preventDefault();
    this.isPhotoDragOver = true;
  }

  onPhotoDragLeave() {
    this.isPhotoDragOver = false;
  }

  onPhotoDrop(event: DragEvent) {
    event.preventDefault();
    this.isPhotoDragOver = false;
    if (event.dataTransfer?.files) {
      this.processPhotoFiles(event.dataTransfer.files);
    }
  }

  processPhotoFiles(files: FileList) {
    Array.from(files).forEach((file) => {
      if (this.isValidFile(file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Data = e.target?.result as string;
          this.imagePreviews.push(base64Data);
          this.photosArray.push(this.fb.control({
            file: file,
            preview: base64Data
          }));
        };
        reader.readAsDataURL(file);
      }
    });

    this.showPhotoError = this.imagePreviews.length === 0;
  }

  removePhoto(index: number) {
    this.imagePreviews.splice(index, 1);
    this.photosArray.removeAt(index);
    this.showPhotoError = this.imagePreviews.length === 0;
  }

  // Floor plan section handlers
  triggerFloorFileInput() {
    this.floorFileInput.nativeElement.click();
  }

  onFloorFileSelect(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) this.processFloorFiles(files);
  }

  onFloorDragOver(event: DragEvent) {
    event.preventDefault();
    this.isFloorDragOver = true;
  }

  onFloorDragLeave() {
    this.isFloorDragOver = false;
  }

  onFloorDrop(event: DragEvent) {
    event.preventDefault();
    this.isFloorDragOver = false;
    if (event.dataTransfer?.files) {
      this.processFloorFiles(event.dataTransfer.files);
    }
  }

  processFloorFiles(files: FileList) {
    Array.from(files).forEach((file) => {
      if (this.isValidFile(file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Data = e.target?.result as string;
          this.floorPreviews.push(base64Data);
          this.floorPlansArray.push(this.fb.control({
            file: file,
            preview: base64Data
          }));
        };
        reader.readAsDataURL(file);
      }
    });

    this.showFloorError = this.floorPreviews.length === 0;
  }

  removeFloorPlan(index: number) {
    this.floorPreviews.splice(index, 1);
    this.floorPlansArray.removeAt(index);
    this.showFloorError = this.floorPreviews.length === 0;
  }

  // Document section handlers
  triggerDocFileInput() {
    this.docFileInput.nativeElement.click();
  }

  onDocFileSelect(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) this.processDocFiles(files);
  }

  onDocDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDocDragOver = true;
  }

  onDocDragLeave() {
    this.isDocDragOver = false;
  }

  onDocDrop(event: DragEvent) {
    event.preventDefault();
    this.isDocDragOver = false;
    if (event.dataTransfer?.files) {
      this.processDocFiles(event.dataTransfer.files);
    }
  }

  processDocFiles(files: FileList) {
    Array.from(files).forEach((file) => {
      if (this.isValidFile(file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Data = e.target?.result as string;
          this.documentPreviews.push(base64Data);
          this.documentsArray.push(this.fb.control({
            file: file,
            preview: base64Data
          }));
        };
        reader.readAsDataURL(file);
      }
    });

    this.showDocError = this.documentPreviews.length === 0;
  }

  removeDocument(index: number) {
    this.documentPreviews.splice(index, 1);
    this.documentsArray.removeAt(index);
    this.showDocError = this.documentPreviews.length === 0;
  }

  // Video methods
  addVideo() {
    this.videosArray.push(this.fb.group({
      title: [''],
      url: [''],
      description: ['']
    }));
  }

  removeVideo(index: number) {
    this.videosArray.removeAt(index);
  }

  // Virtual tour methods
  addVirtualTour() {
    this.virtualToursArray.push(this.fb.group({
      title: [''],
      url: [''],
      description: ['']
    }));
  }

  removeVirtualTour(index: number) {
    this.virtualToursArray.removeAt(index);
  }

  // Utility function for all file uploads
  isValidFile(file: File): boolean {
    const validTypes = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png'];
    const isValid = validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024; // 5MB limit
    if (!isValid) alert('Invalid file type or size exceeds 5MB');
    return isValid;
  }
}