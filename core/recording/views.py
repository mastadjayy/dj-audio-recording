from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import AudioRecording
from .forms import AudioRecordingForm


def index(request):
    recordings = AudioRecording.objects.all().order_by('-created_at')
    context = {
        'recordings': recordings
    }
    return render(request, 'recording/index.html', context)


def upload_recording(request):
    if request.method == 'POST' and request.FILES.get('audio_file'):
        form = AudioRecordingForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return JsonResponse({'message': 'Recording uploaded successfully!'}, status=200)
        else:
            return JsonResponse({'error': 'Invalid form data'}, status=400)