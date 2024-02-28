from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from .models import ToDoList, ToDoItem
from django.urls import reverse, reverse_lazy
from django.http import JsonResponse
from django.db.models import Q
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt


class ListListView(ListView):
    model = ToDoList
    template_name = "todo_app/index.html"


def ItemListViewFunc(request, list_id):
    data = {}
    data["todo_list"] = ToDoList.objects.get(id=list_id)
    data["todos_in_todo"] = ToDoItem.objects.filter(
        Q(todo_list_id=list_id) & Q(status="ToDo")
    )
    data["todos_in_progress"] = ToDoItem.objects.filter(
        Q(todo_list_id=list_id) & Q(status="InProgress")
    )
    data["todos_done"] = ToDoItem.objects.filter(
        Q(todo_list_id=list_id) & Q(status="Done")
    )
    return render(request, "todo_app/todo_list.html", data)


class ItemListView(ListView):
    model = ToDoItem
    template_name = "todo_app/todo_list.html"
    context_object_name = "todo_list"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["todo_list"] = ToDoList.objects.get(id=self.kwargs["list_id"])

        return context


class ListCreate(CreateView):
    model = ToDoList

    fields = ["title"]

    def get_context_data(self):
        context = super(ListCreate, self).get_context_data()

        context["title"] = "Add a new list"

        return context


class ItemCreate(CreateView):
    model = ToDoItem

    fields = [
        "todo_list",
        "title",
        "description",
        "due_date",
    ]

    def get_initial(self):
        initial_data = super(ItemCreate, self).get_initial()

        todo_list = ToDoList.objects.get(id=self.kwargs["list_id"])

        initial_data["todo_list"] = todo_list

        return initial_data

    def get_context_data(self):
        context = super(ItemCreate, self).get_context_data()

        todo_list = ToDoList.objects.get(id=self.kwargs["list_id"])

        context["todo_list"] = todo_list

        context["title"] = "Create a new item"

        return context

    def get_success_url(self):
        return reverse("list", args=[self.object.todo_list_id])


class ItemUpdate(UpdateView):
    model = ToDoItem

    fields = [
        "todo_list",
        "title",
        "description",
        "due_date",
        "status",
    ]

    def get_context_data(self):
        context = super(ItemUpdate, self).get_context_data()

        context["todo_list"] = self.object.todo_list

        context["title"] = "Edit item"

        return context

    def get_success_url(self):
        return reverse("list", args=[self.object.todo_list_id])


class ListDelete(DeleteView):
    model = ToDoList
    success_url = reverse_lazy("index")


class ItemDelete(DeleteView):
    model = ToDoItem

    def get_success_url(self):
        return reverse_lazy("list", args=[self.kwargs["list_id"]])

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["todo_list"] = self.object.todo_list
        return context


@csrf_exempt
def update_status(request):
    if request.method == "POST" and request.is_ajax():
        card_id = request.POST.get("id")
        new_status = request.POST.get("status")

        try:
            # Find det tilsvarende ToDoItem i databasen
            todo_item = ToDoItem.objects.get(id=card_id)
            # Opdater statusen for ToDoItem
            todo_item.status = new_status
            todo_item.save()
            return JsonResponse({"success": True})
        except ToDoItem.DoesNotExist:
            return JsonResponse(
                {"success": False, "error": "Task not found"}, status=404
            )
    else:
        return JsonResponse({"success": False, "error": "Invalid request"}, status=400)
