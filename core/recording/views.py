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
    print("FILES: ", request.FILES)
    print("POST: ", request.POST)
    if request.method == "POST" and request.FILES.get("audio_file"):
        audio_file = request.FILES["audio_file"]
        title = request.POST.get("title", "Untitled")

        recording = AudioRecording.objects.create(
            title=title,
            audio_file=audio_file
        )

        return JsonResponse({
            "success": True,
            "id": recording.id,
            "title": recording.title,
            "file_url": recording.audio_file.url,
            "created_at": recording.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })
    
    return JsonResponse({"success": False, 'error': 'No file received'}, status=400)
        #form = AudioRecordingForm(request.POST, request.FILES)
        #if form.is_valid():
        #    form.save()
        #    return JsonResponse({'success': True})
        #else:
        #    return JsonResponse({'success': False, 'errors': form.errors}, status=400)
    #return JsonResponse({"success": False, 'error': 'No file received'}, status=400) """
#            return JsonResponse({'message': 'Recording uploaded successfully!'}, status=200)
#        else:
#            return JsonResponse({'error': 'Invalid form data'}, status=400)