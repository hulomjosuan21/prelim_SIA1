const tempImg = `https://i.scdn.co/image/ab67616d0000b2734198c92ec28483da79c7894d`
const rowTemplate = document.querySelector('#row_tamplate');
const tableBody = document.querySelector("#tableBody");
let toEditStudentId = null;

function calculateAge(birthdate) {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function getAllStudents() {
    $.ajax({
        url: 'backend.php',
        type: 'POST',
        data: {
            action: 'get_all_students'
        }
    }).done(function (response) {
        const responseData = JSON.parse(response);

        if (responseData.status == 200) {
            const students = responseData.data;

            students.forEach(student => {
                const clone = rowTemplate.content.cloneNode(true);

                clone.querySelector("#tdImg").src = tempImg;
                clone.querySelector("#trId").innerHTML = student.student_id;
                clone.querySelector("#trFname").innerHTML = student.first_name;
                clone.querySelector("#trLname").innerHTML = student.last_name;
                clone.querySelector("#trEmail").innerHTML = student.email;
                clone.querySelector("#trGender").innerHTML = student.gender;
                clone.querySelector("#trCourse").innerHTML = student.course;
                clone.querySelector("#trAddress").innerHTML = student.user_address;
                clone.querySelector("#trAge").innerHTML = calculateAge(student.birthdate);
                clone.querySelector("#editBtn").addEventListener('click', () => {
                    setEditModal(
                        student.student_id,
                        student.first_name,
                        student.email,
                        student.course,
                        student.birthdate,
                        student.last_name,
                        student.gender,
                        student.user_address,
                    )
                })
                clone.querySelector('#deleteBtn').addEventListener('click', () => deleteStudent(student.student_id));

                tableBody.appendChild(clone);
            });
        } else if (responseData.status == 404) {
        } else {
            alert(responseData.msg);
        }
    })
}

function getStudentById(student_id) {
    $.ajax({
        url: 'backend.php',
        type: 'POST',
        data: {
            action: 'get_student_by_id',
            student_id
        }
    }).done(function (response) {
        const responseData = JSON.parse(response);
        const student = responseData.data;
        console.log(JSON.stringify(student, null, 2));
    })
}

function addStudent() {
    $('#addForm').submit(function (e) {
        e.preventDefault();
        const formData = {
            firstname: $('#addFirstname').val(),
            email: $('#addEmail').val(),
            course: $('#addCourse').val(),
            birthdate: $('#addBday').val(),
            lastname: $('#addLastname').val(),
            gender: $('#addGender').val(),
            address: $('#addAddress').val(),
            profileImage: $('#addProfile').val()
        }

        $.ajax({
            url: 'backend.php',
            type: 'POST',
            data: {
                action: 'add_student',
                ...formData
            }
        }).done(function (response) {
            const responseData = JSON.parse(response);
            if (responseData.status == 200) {
                alert(responseData.msg);
                location.reload();
            } else {
                alert(responseData.msg);
            }
        })
    });
}

function setEditModal(student_id, editFirstname, editEmail, editCourse, editBday, editLastname, editGender, editAddress) {
    document.getElementById("editModal").showModal();
    toEditStudentId = student_id;
    $('#editFirstname').val(editFirstname)
    $('#editEmail').val(editEmail)
    $('#editCourse').val(editCourse)
    $('#editBday').val(editBday)
    $('#editLastname').val(editLastname)
    $('#editGender').val(editGender)
    $('#editAddress').val(editAddress)
}

function updateStudent() {
    $('#editForm').submit(function (e) {
        e.preventDefault();
        let formData = {
            firstname: $('#editFirstname').val(),
            email: $('#editEmail').val(),
            course: $('#editCourse').val(),
            birthdate: $('#editBday').val(),
            lastname: $('#editLastname').val(),
            gender: $('#editGender').val(),
            address: $('#editAddress').val()
        };

        let profileImage = $('#editProfile').val();
        if (profileImage) {
            formData.profileImage = profileImage;
        }

        $.ajax({
            url: "backend.php",
            type: "POST",
            data: {
                action: "update_student_by_id",
                student_id: toEditStudentId,
                ...formData
            }
        }).done(function (response) {
            const responseData = JSON.parse(response);
            if (responseData.status == 200) {
                alert(responseData.msg);
                location.reload();
            } else {
                alert(responseData.msg);
            }
        })
    });
}

function deleteStudent(student_id) {
    $.ajax({
        url: 'backend.php',
        type: 'POST',
        data: {
            action: 'delete_student',
            student_id
        }
    }).done(function (response) {
        const responseData = JSON.parse(response);
        if (responseData.status == 200) {
            alert(responseData.msg);
            location.reload();
        } else {
            alert(responseData.msg);
        }
    })
}

function main() {
    getAllStudents();

    addStudent();

    updateStudent();
}

$(document).ready(main)