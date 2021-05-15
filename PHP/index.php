<!DOCTYPE html>
<html>
<body>

<h1>ImageToAscii - PHP</h1>
<br>

<form action="upload.php" method="post" enctype="multipart/form-data">
    Image:
    <input type="file" name="fileToUpload" id="fileToUpload">
    <br>
    Width:
    <input type="number" name="desired_width" id="desired_width">
    <br>
    Font
    <br/>
    <input type="radio" id="Consolas" name="font" value="Consolas" checked>
    <label for="Consolas">Consolas</label><br>
    <input type="radio" id="Courier New" name="font" value="Courier New">
    <label for="Courier New">Courier New</label><br>
    <input type="radio" id="Lucida Console" name="font" value="Lucida Console">
    <label for="Lucida Console">Lucida Console</label><br>
    Intencity Ramp:
    <input type="text" id="ramp" name="ramp" value="$$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?+~i!lI;:,^`'.  "><br>

    <input type="submit" value="Upload Image" name="submit">
</form>

</body>
</html>
