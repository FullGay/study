z = 0
while z <= 4
    (2**z).times do |x|
        (2**z).times do |y|
            system("convert #{z}/#{x}/#{y}.txt #{z}/#{x}/#{y}.png")
            y += 1  
       end
       x += 1
    end
    z += 1
end
