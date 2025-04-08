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
  
  // storage for media previews
  imagePreviews: string[] = [];
  floorPreviews: string[] = [];
  documentPreviews: string[] = [];
  
  // Data models for videos and virtual tours
  videos: { title: string, url: string, description: string }[] = [];
  virtualTours: { title: string, url: string, description: string }[] = [];
  
  // UI state tracking
  isPhotoDragOver: boolean = false;
  isFloorDragOver: boolean = false;
  isDocDragOver: boolean = false;
  showPhotoError: boolean = false;
  showFloorError: boolean = false;
  showDocError: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Initialize the media form if it doesn't exist yet
    if (!this.parentForm.get('media')) {
      this.parentForm.addControl('media', this.fb.group({
        photos: [[]],
        floorPlans: [[]],
        documents: [[]],
        videos: this.fb.array([]),
        virtualTours: this.fb.array([])
      }));
    }
    
    // Get the form controls
    const mediaForm = this.parentForm.get('media') as FormGroup;
    const videosArray = mediaForm.get('videos') as FormArray;
    const virtualToursArray = mediaForm.get('virtualTours') as FormArray;
    
    // Initialize with any existing data from the form
    if (mediaForm.value.photos?.length) this.imagePreviews = mediaForm.value.photos;
    if (mediaForm.value.floorPlans?.length) this.floorPreviews = mediaForm.value.floorPlans;
    if (mediaForm.value.documents?.length) this.documentPreviews = mediaForm.value.documents;
    
    // Update the form with our current values
    this.updateFormValue('photos', this.imagePreviews);
    this.updateFormValue('floorPlans', this.floorPreviews);
    this.updateFormValue('documents', this.documentPreviews);
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
          const preview = e.target?.result as string;
          this.imagePreviews.push(preview);
          // Update the form value
          this.updateFormValue('photos', this.imagePreviews);
        };
        reader.readAsDataURL(file);
      }
    });

    this.showPhotoError = this.imagePreviews.length === 0;
  }

  removePhoto(index: number) {
    this.imagePreviews.splice(index, 1);
    this.showPhotoError = this.imagePreviews.length === 0;
    this.updateFormValue('photos', this.imagePreviews);
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
          const preview = e.target?.result as string;
          this.floorPreviews.push(preview);
          // Update the form value
          this.updateFormValue('floorPlans', this.floorPreviews);
        };
        reader.readAsDataURL(file);
      }
    });

    this.showFloorError = this.floorPreviews.length === 0;
  }

  removeFloorPlan(index: number) {
    this.floorPreviews.splice(index, 1);
    this.showFloorError = this.floorPreviews.length === 0;
    this.updateFormValue('floorPlans', this.floorPreviews);
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
          const preview = e.target?.result as string;
          this.documentPreviews.push(preview);
          // Update the form value
          this.updateFormValue('documents', this.documentPreviews);
        };
        reader.readAsDataURL(file);
      }
    });

    this.showDocError = this.documentPreviews.length === 0;
  }

  removeDocument(index: number) {
    this.documentPreviews.splice(index, 1);
    this.showDocError = this.documentPreviews.length === 0;
    this.updateFormValue('documents', this.documentPreviews);
  }

  // Video methods
  addVideo() {
    const newVideo = { title: '', url: '', description: '' };
    this.videos.push(newVideo);
    
    // Add to form array
    const videosArray = this.getVideosArray();
    videosArray.push(this.createVideoFormGroup(newVideo));
  }

  removeVideo(index: number) {
    this.videos.splice(index, 1);
    
    // Remove from form array
    const videosArray = this.getVideosArray();
    videosArray.removeAt(index);
  }

  // Virtual tour methods
  addVirtualTour() {
    const newTour = { title: '', url: '', description: '' };
    this.virtualTours.push(newTour);
    
    // Add to form array
    const toursArray = this.getVirtualToursArray();
    toursArray.push(this.createTourFormGroup(newTour));
  }

  removeVirtualTour(index: number) {
    this.virtualTours.splice(index, 1);
    
    // Remove from form array
    const toursArray = this.getVirtualToursArray();
    toursArray.removeAt(index);
  }

  // Form utilities
  getMediaForm(): FormGroup {
    return this.parentForm.get('media') as FormGroup;
  }

  getVideosArray(): FormArray {
    return this.getMediaForm().get('videos') as FormArray;
  }

  getVirtualToursArray(): FormArray {
    return this.getMediaForm().get('virtualTours') as FormArray;
  }

  createVideoFormGroup(video: { title: string, url: string, description: string }) {
    return this.fb.group({
      title: [video.title],
      url: [video.url],
      description: [video.description]
    });
  }

  createTourFormGroup(tour: { title: string, url: string, description: string }) {
    return this.fb.group({
      title: [tour.title],
      url: [tour.url],
      description: [tour.description]
    });
  }

  // Update form values
  updateFormValue(field: string, value: any) {
    const mediaForm = this.getMediaForm();
    const control = mediaForm.get(field);
    if (control) {
      control.setValue(value);
    }
  }

  // Update form when ngModel changes
  onVideoInputChange(index: number) {
    const videoFormGroup = this.getVideosArray().at(index) as FormGroup;
    videoFormGroup.patchValue(this.videos[index]);
  }

  onTourInputChange(index: number) {
    const tourFormGroup = this.getVirtualToursArray().at(index) as FormGroup;
    tourFormGroup.patchValue(this.virtualTours[index]);
  }

  // Utility function for all file uploads
  isValidFile(file: File): boolean {
    const validTypes = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png'];
    const isValid = validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024; // 5MB limit
    if (!isValid) alert('Invalid file type or size exceeds 5MB');
    return isValid;
  }
}